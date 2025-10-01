import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs/promises';

export async function parseDocument(filePath: string): Promise<string> {
  try {
    // Check if file exists
    await fs.access(filePath);
    
    // Document AI temporarily disabled due to configuration issues
    // Using JavaScript parsing for now (fast and reliable)
    console.log('🔍 Using JavaScript parsing (Document AI disabled)');
    
    // JavaScript parsing (fast and reliable)
    const fileExtension = path.extname(filePath).toLowerCase();
    
    switch (fileExtension) {
      case '.pdf':
        return await parsePDF(filePath);
      case '.docx':
        return await parseDOCX(filePath);
      case '.doc':
        return await parseDOC(filePath);
      case '.txt':
        return await parseTXT(filePath);
      default:
        throw new Error(`Unsupported file type: ${fileExtension}`);
    }
  } catch (error) {
    throw new Error(`Document parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function parsePDF(filePath: string): Promise<string> {
  try {
    // Use fast JavaScript PDF parser
    const pdfParse = require('pdf-parse');
    const fs = require('fs');
    
    console.log(`📄 Attempting to parse PDF: ${filePath}`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    
    console.log(`✅ PDF parsed successfully: ${data.numpages} pages, ${data.text.length} characters`);
    return data.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    return extractTextFallback(filePath);
  }
}

async function parseDOCX(filePath: string): Promise<string> {
  try {
    // Use fast JavaScript DOCX parser
    const mammoth = require('mammoth');
    const fs = require('fs');
    
    console.log(`📄 Attempting to parse DOCX: ${filePath}`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const buffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer });
    
    console.log(`✅ DOCX parsed successfully: ${result.value.length} characters`);
    return result.value;
  } catch (error) {
    console.error('DOCX parsing error:', error);
    return extractTextFallback(filePath);
  }
}

async function parseDOC(filePath: string): Promise<string> {
  // For older DOC files, use fallback
  return extractTextFallback(filePath);
}

async function parseTXT(filePath: string): Promise<string> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    throw new Error(`Failed to read text file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Fallback text extraction for when Python script is not available
export async function extractTextFallback(filePath: string): Promise<string> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    // Basic text extraction - in production, use proper PDF/DOCX libraries
    if (filePath.endsWith('.txt')) {
      return fileContent;
    }
    
    // For other formats, return a message indicating processing is needed
    return "Document uploaded successfully. Text extraction requires additional processing.";
  } catch (error) {
    throw new Error(`Fallback text extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
