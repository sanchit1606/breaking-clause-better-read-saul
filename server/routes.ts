import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { simplifyDocumentWithGemini, askQuestionWithGemini } from "./services/gemini";
import { parseDocument } from "./services/document-parser";
import { searchSimilarClauses } from "./services/vector-search";
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
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
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

      const document = await storage.createDocument({
        userId: null, // For now, no user system
        fileName: req.file.originalname,
        originalText: null,
        simplifiedClauses: null,
        embeddings: null,
      });

      // Start document processing in the background
      processDocumentAsync(req.file.path, document.id);

      res.json({
        documentId: document.id,
        message: "Document uploaded successfully"
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
      
      const document = await storage.getDocument(documentId);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      if (!document.originalText) {
        return res.status(400).json({ message: "Document not yet processed" });
      }

      const simplifiedClauses = await simplifyDocumentWithGemini(document.originalText);
      
      await storage.updateDocument(documentId, {
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
      
      const document = await storage.getDocument(documentId);
      if (!document || !document.originalText) {
        return res.status(404).json({ message: "Document not found or not processed" });
      }

      // Search for relevant clauses
      const relevantClauses = await searchSimilarClauses(question, documentId);
      
      // Generate answer using Gemini
      const answer = await askQuestionWithGemini(question, document.originalText, relevantClauses);

      // Save conversation
      await storage.createConversation({
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
      
      // Mock translation for now
      const translatedText = `[${targetLanguage.toUpperCase()}] ${text}`;
      
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
      
      // Mock TTS - return a placeholder audio URL
      const audioUrl = `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+HyvGcVGRw`;
      
      res.json({ audioUrl });
    } catch (error) {
      console.error("TTS error:", error);
      res.status(500).json({ message: "TTS failed" });
    }
  });

  // Get document endpoint
  app.get("/api/documents/:id/simplified", async (req, res) => {
    try {
      const document = await storage.getDocument(req.params.id);
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
async function processDocumentAsync(filePath: string, documentId: string) {
  try {
    const extractedText = await parseDocument(filePath);
    await storage.updateDocument(documentId, {
      originalText: extractedText,
      status: "processed"
    });
  } catch (error) {
    console.error("Document processing error:", error);
    await storage.updateDocument(documentId, {
      status: "failed"
    });
  }
}
