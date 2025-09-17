import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs/promises';

export async function parseDocument(filePath: string): Promise<string> {
  try {
    // Check if file exists
    await fs.access(filePath);
    
    // Call Python script for document parsing
    const pythonScript = path.join(process.cwd(), 'server', 'services', 'document-parser.py');
    
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python3', [pythonScript, filePath]);
      
      let output = '';
      let errorOutput = '';
      
      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });
      
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Document parsing failed: ${errorOutput}`));
          return;
        }
        
        try {
          const result = JSON.parse(output);
          if (result.success) {
            resolve(result.text);
          } else {
            reject(new Error(result.error));
          }
        } catch (parseError) {
          reject(new Error(`Failed to parse output: ${parseError}`));
        }
      });
      
      pythonProcess.on('error', (error) => {
        reject(new Error(`Failed to run Python script: ${error.message}`));
      });
    });
  } catch (error) {
    throw new Error(`Document parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
