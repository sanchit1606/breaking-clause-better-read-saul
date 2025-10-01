import { Storage, Bucket } from '@google-cloud/storage';
import { storageClient } from './google-cloud';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Configuration
const BUCKET_NAME = 'breaking-clause-documents';
const PROJECT_ID = 'your-gcp-project-id';

export interface DocumentMetadata {
  id: string;
  originalName: string;
  contentType: string;
  size: number;
  uploadedAt: Date;
  processedAt?: Date;
  simplifiedClauses?: any[];
  summary?: string;
  keyTerms?: string[];
}

export class GCSDocumentStorage {
  private storage: Storage | null;
  private bucket: Bucket | null;

  constructor() {
    this.storage = storageClient;
    this.bucket = null;
    
    if (this.storage) {
      this.bucket = this.storage.bucket(BUCKET_NAME);
    }
  }

  /**
   * Ensure the bucket exists, create if it doesn't
   */
  private async ensureBucketExists(): Promise<boolean> {
    if (!this.bucket) {
      console.log('Storage client not available, using local fallback');
      return false;
    }

    try {
      const [exists] = await this.bucket.exists();
      if (!exists) {
        console.log(`Creating bucket: ${BUCKET_NAME}`);
        await this.bucket.create({
          location: 'US',
          storageClass: 'STANDARD',
          versioning: {
            enabled: true
          }
        });
        console.log(`✅ Bucket ${BUCKET_NAME} created successfully`);
      }
      return true;
    } catch (error) {
      console.error('Failed to create/access bucket:', error);
      return false;
    }
  }

  /**
   * Upload a document to Google Cloud Storage
   */
  async uploadDocument(
    fileBuffer: Buffer, 
    originalName: string, 
    contentType: string
  ): Promise<{ documentId: string; metadata: DocumentMetadata }> {
    const documentId = uuidv4();
    const fileExtension = path.extname(originalName);
    const fileName = `${documentId}${fileExtension}`;
    
    // Try GCS first
    if (await this.ensureBucketExists()) {
      try {
        const file = this.bucket!.file(fileName);
        
        await file.save(fileBuffer, {
          metadata: {
            contentType,
            metadata: {
              originalName,
              documentId,
              uploadedAt: new Date().toISOString()
            }
          }
        });

        const metadata: DocumentMetadata = {
          id: documentId,
          originalName,
          contentType,
          size: fileBuffer.length,
          uploadedAt: new Date()
        };

        console.log(`✅ Document uploaded to GCS: ${fileName}`);
        return { documentId, metadata };
      } catch (error) {
        console.error('GCS upload failed, falling back to local storage:', error);
      }
    }

    // Fallback to local storage
    return this.uploadToLocal(fileBuffer, originalName, contentType, documentId);
  }

  /**
   * Download a document from Google Cloud Storage
   */
  async downloadDocument(documentId: string): Promise<Buffer | null> {
    if (!await this.ensureBucketExists()) {
      return this.downloadFromLocal(documentId);
    }

    try {
      // Find the file by documentId (search in metadata)
      const [files] = await this.bucket!.getFiles({
        prefix: documentId
      });

      if (files.length === 0) {
        console.log(`Document ${documentId} not found in GCS`);
        return null;
      }

      const file = files[0];
      const [fileBuffer] = await file.download();
      
      console.log(`✅ Document downloaded from GCS: ${file.name}`);
      return fileBuffer;
    } catch (error) {
      console.error('GCS download failed, trying local fallback:', error);
      return this.downloadFromLocal(documentId);
    }
  }

  /**
   * Store processed results (simplified clauses, summary, etc.)
   */
  async storeProcessedResults(
    documentId: string, 
    results: {
      simplifiedClauses?: any[];
      summary?: string;
      keyTerms?: string[];
    }
  ): Promise<void> {
    const resultsFileName = `${documentId}-results.json`;
    
    if (await this.ensureBucketExists()) {
      try {
        const file = this.bucket!.file(resultsFileName);
        const resultsData = {
          documentId,
          processedAt: new Date().toISOString(),
          ...results
        };

        await file.save(JSON.stringify(resultsData, null, 2), {
          metadata: {
            contentType: 'application/json',
            metadata: {
              documentId,
              type: 'processed-results'
            }
          }
        });

        console.log(`✅ Processed results stored in GCS: ${resultsFileName}`);
        return;
      } catch (error) {
        console.error('GCS results storage failed, using local fallback:', error);
      }
    }

    // Fallback to local storage
    this.storeResultsLocally(documentId, results);
  }

  /**
   * Retrieve processed results
   */
  async getProcessedResults(documentId: string): Promise<any | null> {
    const resultsFileName = `${documentId}-results.json`;
    
    if (await this.ensureBucketExists()) {
      try {
        const file = this.bucket!.file(resultsFileName);
        const [exists] = await file.exists();
        
        if (!exists) {
          return await this.getResultsLocally(documentId);
        }

        const [fileBuffer] = await file.download();
        const results = JSON.parse(fileBuffer.toString());
        
        console.log(`✅ Processed results retrieved from GCS: ${resultsFileName}`);
        return results;
      } catch (error) {
        console.error('GCS results retrieval failed, trying local fallback:', error);
        return await this.getResultsLocally(documentId);
      }
    }

    return await this.getResultsLocally(documentId);
  }

  /**
   * Delete a document and its processed results
   */
  async deleteDocument(documentId: string): Promise<void> {
    if (await this.ensureBucketExists()) {
      try {
        // Find and delete the document file
        const [files] = await this.bucket!.getFiles({
          prefix: documentId
        });

        for (const file of files) {
          await file.delete();
          console.log(`✅ Deleted from GCS: ${file.name}`);
        }
        return;
      } catch (error) {
        console.error('GCS deletion failed, trying local cleanup:', error);
      }
    }

    // Fallback to local cleanup
    this.deleteLocally(documentId);
  }

  // Local storage fallback methods
  private async uploadToLocal(
    fileBuffer: Buffer, 
    originalName: string, 
    contentType: string, 
    documentId: string
  ): Promise<{ documentId: string; metadata: DocumentMetadata }> {
    const fs = await import('fs/promises');
    const uploadsDir = path.join(process.cwd(), 'uploads');
    
    // Ensure uploads directory exists
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    const fileName = `${documentId}${path.extname(originalName)}`;
    const filePath = path.join(uploadsDir, fileName);
    
    await fs.writeFile(filePath, fileBuffer);

    const metadata: DocumentMetadata = {
      id: documentId,
      originalName,
      contentType,
      size: fileBuffer.length,
      uploadedAt: new Date()
    };

    console.log(`📁 Document stored locally: ${fileName}`);
    return { documentId, metadata };
  }

  private async downloadFromLocal(documentId: string): Promise<Buffer | null> {
    const fs = await import('fs/promises');
    const uploadsDir = path.join(process.cwd(), 'uploads');
    
    try {
      const files = await fs.readdir(uploadsDir);
      const file = files.find(f => f.startsWith(documentId));
      
      if (!file) {
        return null;
      }

      const filePath = path.join(uploadsDir, file);
      const fileBuffer = await fs.readFile(filePath);
      
      console.log(`📁 Document loaded from local storage: ${file}`);
      return fileBuffer;
    } catch (error) {
      console.error('Local download failed:', error);
      return null;
    }
  }

  private storeResultsLocally(documentId: string, results: any): void {
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const resultsPath = path.join(uploadsDir, `${documentId}-results.json`);
    
    try {
      fs.writeFileSync(resultsPath, JSON.stringify({
        documentId,
        processedAt: new Date().toISOString(),
        ...results
      }, null, 2));
      
      console.log(`📁 Results stored locally: ${documentId}-results.json`);
    } catch (error) {
      console.error('Local results storage failed:', error);
    }
  }

  private async getResultsLocally(documentId: string): Promise<any | null> {
    const fs = await import('fs/promises');
    const path = await import('path');
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const resultsPath = path.join(uploadsDir, `${documentId}-results.json`);
    
    try {
      await fs.access(resultsPath);
      const data = await fs.readFile(resultsPath, 'utf8');
      console.log(`📁 Results loaded from local storage: ${documentId}-results.json`);
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null; // File doesn't exist
      }
      console.error('Local results retrieval failed:', error);
      return null;
    }
  }

  private deleteLocally(documentId: string): void {
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(process.cwd(), 'uploads');
    
    try {
      const files = fs.readdirSync(uploadsDir);
      const filesToDelete = files.filter((f: string) => f.startsWith(documentId));
      
      for (const file of filesToDelete) {
        const filePath = path.join(uploadsDir, file);
        fs.unlinkSync(filePath);
        console.log(`📁 Deleted locally: ${file}`);
      }
    } catch (error) {
      console.error('Local cleanup failed:', error);
    }
  }
}

// Export singleton instance
export const gcsStorage = new GCSDocumentStorage();
