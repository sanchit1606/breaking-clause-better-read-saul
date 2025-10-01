import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { firestoreEnhancedStorage } from "./services/firestore-enhanced-storage";
import { 
  simplifyDocumentWithGemini, 
  askQuestionWithGemini, 
  translateTextWithGemini, 
  generateTTSWithGemini,
  extractKeyTermsWithGemini,
  generateDocumentSummaryWithGemini
} from "./services/gemini";
import { parseDocument } from "./services/document-parser";
import { searchSimilarClauses, createEmbeddings } from "./services/vector-search";
import { insertDocumentSchema, insertConversationSchema } from "@shared/schema";
import { z } from "zod";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    console.log(`File upload attempt: ${file.originalname}, MIME type: ${file.mimetype}`);
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.log(`Rejected file type: ${file.mimetype}`);
      cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
    }
  }
});

const simplifyRequestSchema = z.object({
  documentId: z.string()
});

const qaRequestSchema = z.object({
  documentId: z.string(),
  question: z.string().min(1, "Question cannot be empty")
});

const translateRequestSchema = z.object({
  text: z.string().min(1, "Text cannot be empty"),
  targetLanguage: z.string().length(2, "Language code must be 2 characters")
});

const ttsRequestSchema = z.object({
  text: z.string().min(1, "Text cannot be empty"),
  language: z.string().length(2).optional()
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Document upload endpoint
  app.post("/api/upload", upload.single('file'), async (req: MulterRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Read file buffer
      const fs = await import('fs/promises');
      const fileBuffer = await fs.readFile(req.file.path);

      let documentId: string;
      let metadata: any;
      let storageType: string;

      try {
        // Try to upload to GCS and create document record
        const result = await firestoreEnhancedStorage.uploadDocumentFile(
          fileBuffer,
          req.file.originalname,
          req.file.mimetype
        );
        documentId = result.documentId;
        metadata = result.metadata;
        storageType = "Google Cloud Storage";
      } catch (gcsError) {
        console.log("GCS upload failed, falling back to local storage:", gcsError.message);
        
        // Fallback to local storage
        const { v4: uuidv4 } = await import('uuid');
        const path = await import('path');
        
        // Create document ID
        documentId = uuidv4();
        
        // Store file locally
        const localFileName = `${documentId}${path.extname(req.file.originalname)}`;
        const localFilePath = path.join('uploads', localFileName);
        
        // Ensure uploads directory exists
        await fs.mkdir('uploads', { recursive: true });
        
        // Copy file to permanent location
        await fs.copyFile(req.file.path, localFilePath);
        
        // Create document metadata in Firestore only
        const documentData = {
          fileName: localFileName,
          originalName: req.file.originalname,
          contentType: req.file.mimetype,
          size: fileBuffer.length,
          uploadedAt: new Date(),
          status: 'uploaded' as const,
          gcsDocumentId: localFileName // Use local filename as reference
        };
        
        metadata = await firestoreEnhancedStorage.createDocument(documentData);
        storageType = "Local Storage";
      }

      // Clean up local temp file
      await fs.unlink(req.file.path);

      // Start document processing in the background
      processDocumentAsync(metadata.gcsDocumentId || metadata.id, documentId);

      res.json({
        documentId: documentId,
        message: `Document uploaded successfully to ${storageType} and Firestore`
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Upload failed" });
    }
  });

  // Document simplification endpoint
  app.post("/api/simplify", async (req, res) => {
    try {
      const { documentId } = simplifyRequestSchema.parse(req.body);
      
      const document = await firestoreEnhancedStorage.getDocument(documentId);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      if (!document.originalText) {
        return res.status(400).json({ message: "Document not yet processed" });
      }

      const simplifiedClauses = await simplifyDocumentWithGemini(document.originalText);
      
      await firestoreEnhancedStorage.updateDocument(documentId, {
        simplifiedClauses: simplifiedClauses,
        processedAt: new Date(),
        status: "completed"
      });

      res.json({ clauses: simplifiedClauses });
    } catch (error) {
      console.error("Simplification error:", error);
      res.status(500).json({ message: "Simplification failed" });
    }
  });

  // Q&A endpoint
  app.post("/api/qa", async (req, res) => {
    try {
      const { documentId, question } = qaRequestSchema.parse(req.body);
      
      const document = await firestoreEnhancedStorage.getDocument(documentId);
      if (!document || !document.originalText) {
        return res.status(404).json({ message: "Document not found or not processed" });
      }

      // Search for relevant clauses
      const relevantClauses = await searchSimilarClauses(question, documentId);
      
      // Generate answer using Gemini
      const answer = await askQuestionWithGemini(question, document.originalText, relevantClauses);

      // Save conversation
      await firestoreEnhancedStorage.createConversation({
        documentId,
        question,
        answer,
        language: "en"
      });

      res.json({
        answer,
        relevantClauses: relevantClauses.map(c => c.id)
      });
    } catch (error) {
      console.error("Q&A error:", error);
      res.status(500).json({ message: "Q&A failed" });
    }
  });

  // Translation endpoint
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, targetLanguage } = translateRequestSchema.parse(req.body);
      
      const translatedText = await translateTextWithGemini(text, targetLanguage);
      
      res.json({
        translatedText,
        language: targetLanguage
      });
    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).json({ message: "Translation failed" });
    }
  });

  // Text-to-Speech endpoint
  app.post("/api/tts", async (req, res) => {
    try {
      const { text, language = "en" } = ttsRequestSchema.parse(req.body);
      
      const audioUrl = await generateTTSWithGemini(text, language);
      
      res.json({ audioUrl });
    } catch (error) {
      console.error("TTS error:", error);
      res.status(500).json({ message: "TTS failed" });
    }
  });

  // Get document endpoint
  app.get("/api/documents/:id/simplified", async (req, res) => {
    try {
      const document = await firestoreEnhancedStorage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      res.json({
        fileName: document.fileName,
        clauses: document.simplifiedClauses,
        status: document.status
      });
    } catch (error) {
      console.error("Get document error:", error);
      res.status(500).json({ message: "Failed to get document" });
    }
  });

  // Document summary endpoint
  app.get("/api/documents/:id/summary", async (req, res) => {
    try {
      const document = await firestoreEnhancedStorage.getDocument(req.params.id);
      if (!document || !document.originalText) {
        return res.status(404).json({ message: "Document not found or not processed" });
      }

      const summary = await generateDocumentSummaryWithGemini(document.originalText);
      
      res.json({ summary });
    } catch (error) {
      console.error("Document summary error:", error);
      res.status(500).json({ message: "Failed to generate summary" });
    }
  });

  // Key terms extraction endpoint
  app.get("/api/documents/:id/terms", async (req, res) => {
    try {
      const document = await firestoreEnhancedStorage.getDocument(req.params.id);
      if (!document || !document.originalText) {
        return res.status(404).json({ message: "Document not found or not processed" });
      }

      const terms = await extractKeyTermsWithGemini(document.originalText);
      
      res.json({ terms });
    } catch (error) {
      console.error("Key terms extraction error:", error);
      res.status(500).json({ message: "Failed to extract key terms" });
    }
  });

  // Agent status endpoint
  app.get("/api/agents/status", async (req, res) => {
    try {
      const agents = [
        { name: "Doc Simplifier", status: "active" },
        { name: "Q&A Agent", status: "ready" },
        { name: "Translation Agent", status: "standby" },
        { name: "TTS Agent", status: "standby" }
      ];

      res.json(agents);
    } catch (error) {
      console.error("Agent status error:", error);
      res.status(500).json({ message: "Failed to get agent status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Background document processing
async function processDocumentAsync(gcsDocumentId: string, dbDocumentId: string) {
  try {
    console.log(`Processing document ${dbDocumentId}...`);
    
    // Step 1: Get document file (from GCS or local storage)
    let fileBuffer: Buffer;
    let tempPath: string;
    
    try {
      // Try to download from GCS first
      fileBuffer = await firestoreEnhancedStorage.downloadDocumentFile(dbDocumentId);
      if (!fileBuffer) {
        throw new Error('Failed to download document from GCS');
      }
      
      // Create a temporary file for parsing with proper extension
      const fs = await import('fs/promises');
      const fileExtension = path.extname(gcsDocumentId) || '.pdf'; // Default to PDF if no extension
      tempPath = `uploads/temp-${dbDocumentId}${fileExtension}`;
      await fs.writeFile(tempPath, fileBuffer);
    } catch (gcsError) {
      console.log("GCS download failed, trying local storage:", gcsError.message);
      
      // Fallback to local storage
      const fs = await import('fs/promises');
      const localFilePath = path.join('uploads', gcsDocumentId);
      
      try {
        fileBuffer = await fs.readFile(localFilePath);
        // Create a temporary file with proper extension for parsing
        const fileExtension = path.extname(gcsDocumentId) || '.pdf'; // Default to PDF if no extension
        const tempFileName = `temp-${dbDocumentId}${fileExtension}`;
        tempPath = path.join('uploads', tempFileName);
        await fs.writeFile(tempPath, fileBuffer);
      } catch (localError) {
        throw new Error(`Failed to read document from both GCS and local storage: ${localError.message}`);
      }
    }
    
    const extractedText = await parseDocument(tempPath);
    await firestoreEnhancedStorage.updateDocument(dbDocumentId, {
      status: "processing"
    });

    // Step 2-4: Process document in parallel for faster results
    console.log(`Processing document ${dbDocumentId} with AI...`);
    const [summary, terms, simplifiedClauses] = await Promise.all([
      generateDocumentSummaryWithGemini(extractedText),
      extractKeyTermsWithGemini(extractedText),
      simplifyDocumentWithGemini(extractedText)
    ]);
    
    // Step 5: Create embeddings for vector search (run in background)
    console.log(`Creating embeddings for document ${dbDocumentId}...`);
    createEmbeddings(dbDocumentId, simplifiedClauses).catch(err => 
      console.log('Embeddings creation failed:', err.message)
    );
    
    // Step 6: Store processed results and update Firestore
    try {
      // Try to store in GCS first
      await firestoreEnhancedStorage.storeProcessedResults(dbDocumentId, {
        simplifiedClauses: simplifiedClauses,
        summary: summary,
        keyTerms: terms
      });
    } catch (gcsError) {
      console.log("GCS storage failed, storing results in Firestore only:", gcsError.message);
      
      // Fallback: store results directly in Firestore document
      await firestoreEnhancedStorage.updateDocument(dbDocumentId, {
        status: "completed",
        processedAt: new Date(),
        // Store results as JSON in the document
        simplifiedClauses: JSON.stringify(simplifiedClauses),
        summary: summary,
        keyTerms: JSON.stringify(terms)
      });
    }

    // Clean up temporary file if it was created
    if (tempPath.startsWith('uploads/temp-')) {
      const fs = await import('fs/promises');
      await fs.unlink(tempPath);
    }

    console.log(`Document ${dbDocumentId} processing completed successfully`);
  } catch (error) {
    console.error("Document processing error:", error);
    await firestoreEnhancedStorage.updateDocument(dbDocumentId, {
      status: "failed",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
