import { documentAIClient } from './google-cloud';
import fs from 'fs/promises';
import path from 'path';

// Document AI processor configuration
const PROJECT_ID = 'your-gcp-project-id';
const LOCATION = 'eu'; // EU region - better for India than US (150-200ms vs 200-300ms)
// Document OCR processor - FREE for first 1,000 pages/month
const PROCESSOR_ID = 'your-processor-id'; // Your EU processor ID

export async function parseDocumentWithAI(filePath: string): Promise<string> {
  try {
    if (!documentAIClient) {
      console.log('⚠️ Document AI client not available, falling back to JavaScript parsing');
      return await parseDocumentFallback(filePath);
    }

    console.log(`🚀 Parsing document with Google Document AI: ${filePath}`);
    
    // Read the file
    const fileBuffer = await fs.readFile(filePath);
    const fileExtension = path.extname(filePath).toLowerCase();
    
    console.log(`🔍 Document AI parsing: ${filePath}, extension: "${fileExtension}"`);
    
    // Determine MIME type - Document AI supports PDF, DOCX, and images
    let mimeType: string;
    switch (fileExtension) {
      case '.pdf':
        mimeType = 'application/pdf';
        break;
      case '.docx':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case '.doc':
        // Document AI doesn't support .doc, use fallback
        console.log(`⚠️ Document AI doesn't support .doc files, using fallback`);
        return await parseDocumentFallback(filePath);
      case '.txt':
        // Document AI doesn't support .txt, use fallback
        console.log(`⚠️ Document AI doesn't support .txt files, using fallback`);
        return await parseDocumentFallback(filePath);
      default:
        console.log(`⚠️ Unsupported file type for Document AI: "${fileExtension}", using fallback`);
        return await parseDocumentFallback(filePath);
    }

    // Create the processor name
    const processorName = `projects/${PROJECT_ID}/locations/${LOCATION}/processors/${PROCESSOR_ID}`;

    // Prepare the request with correct format
    const request = {
      name: processorName,
      rawDocument: {
        content: fileBuffer,
        mimeType: mimeType,
      },
      skipHumanReview: true, // Skip human review for faster processing
    };

    // Process the document
    const [result] = await documentAIClient.processDocument(request);
    
    if (result.document?.text) {
      const extractedText = result.document.text;
      console.log(`✅ Document AI parsed successfully: ${extractedText.length} characters`);
      return extractedText;
    } else {
      console.log('⚠️ No text extracted by Document AI, using fallback');
      return await parseDocumentFallback(filePath);
    }

  } catch (error: any) {
    // Only log the error once, don't spam
    if (error.message.includes('INVALID_ARGUMENT')) {
      console.log('⚠️ Document AI configuration issue, using JavaScript parsing');
    } else {
      console.log('⚠️ Document AI failed, using JavaScript parsing:', error.message);
    }
    return await parseDocumentFallback(filePath);
  }
}

// Fallback to JavaScript parsing
async function parseDocumentFallback(filePath: string): Promise<string> {
  const { parseDocument } = await import('./document-parser');
  return await parseDocument(filePath);
}

// Get document structure and entities (bonus feature)
export async function getDocumentStructure(filePath: string): Promise<any> {
  try {
    if (!documentAIClient) {
      return null;
    }

    const fileBuffer = await fs.readFile(filePath);
    const fileExtension = path.extname(filePath).toLowerCase();
    
    let mimeType: string;
    switch (fileExtension) {
      case '.pdf':
        mimeType = 'application/pdf';
        break;
      case '.docx':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      default:
        return null;
    }

    const processorName = `projects/${PROJECT_ID}/locations/${LOCATION}/processors/${PROCESSOR_ID}`;
    const request = {
      name: processorName,
      rawDocument: {
        content: fileBuffer,
        mimeType: mimeType,
      },
    };

    const [result] = await documentAIClient.processDocument(request);
    
    return {
      text: result.document?.text || '',
      entities: result.document?.entities || [],
      pages: result.document?.pages || [],
      confidence: result.document?.confidence || 0
    };

  } catch (error: any) {
    console.error('❌ Document structure extraction failed:', error.message);
    return null;
  }
}
