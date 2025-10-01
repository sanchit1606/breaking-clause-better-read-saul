import { firestoreService, DocumentMetadata, ConversationData } from './firestore-service';
import { gcsStorage } from './gcs-storage';
import { SimplifiedClause } from '@shared/schema';

export interface EnhancedDocument extends DocumentMetadata {
  originalText?: string;
  simplifiedClauses?: SimplifiedClause[];
  summary?: string;
  keyTerms?: string[];
}

export interface IEnhancedStorage {
  // Document methods
  getDocument(id: string): Promise<EnhancedDocument | undefined>;
  createDocument(document: Omit<DocumentMetadata, 'id'>): Promise<EnhancedDocument>;
  updateDocument(id: string, updates: Partial<DocumentMetadata>): Promise<EnhancedDocument | undefined>;
  getUserDocuments(userId: string): Promise<EnhancedDocument[]>;

  // File operations
  uploadDocumentFile(fileBuffer: Buffer, originalName: string, contentType: string): Promise<{ documentId: string; metadata: DocumentMetadata }>;
  downloadDocumentFile(documentId: string): Promise<Buffer | null>;
  storeProcessedResults(documentId: string, results: { simplifiedClauses?: SimplifiedClause[]; summary?: string; keyTerms?: string[] }): Promise<void>;
  getProcessedResults(documentId: string): Promise<any | null>;
  deleteDocumentFile(documentId: string): Promise<void>;

  // Conversation methods
  getConversation(id: string): Promise<ConversationData | undefined>;
  createConversation(conversation: Omit<ConversationData, 'id'>): Promise<ConversationData>;
  getDocumentConversations(documentId: string): Promise<ConversationData[]>;
}

export class FirestoreEnhancedStorage implements IEnhancedStorage {
  // Document methods
  async getDocument(id: string): Promise<EnhancedDocument | undefined> {
    try {
      const document = await firestoreService.getDocument(id);
      if (!document) return undefined;

      // Get processed results from GCS
      const processedResults = await gcsStorage.getProcessedResults(id);
      
      return {
        ...document,
        simplifiedClauses: processedResults?.simplifiedClauses,
        summary: processedResults?.summary,
        keyTerms: processedResults?.keyTerms
      };
    } catch (error) {
      console.error('Error getting document:', error);
      return undefined;
    }
  }

  async createDocument(document: Omit<DocumentMetadata, 'id'>): Promise<EnhancedDocument> {
    try {
      const createdDocument = await firestoreService.createDocument(document);
      return createdDocument as EnhancedDocument;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  async updateDocument(id: string, updates: Partial<DocumentMetadata>): Promise<EnhancedDocument | undefined> {
    try {
      const updatedDocument = await firestoreService.updateDocument(id, updates);
      if (!updatedDocument) return undefined;

      // Get processed results from GCS
      const processedResults = await gcsStorage.getProcessedResults(id);
      
      return {
        ...updatedDocument,
        simplifiedClauses: processedResults?.simplifiedClauses,
        summary: processedResults?.summary,
        keyTerms: processedResults?.keyTerms
      };
    } catch (error) {
      console.error('Error updating document:', error);
      return undefined;
    }
  }

  async getUserDocuments(userId: string): Promise<EnhancedDocument[]> {
    try {
      const documents = await firestoreService.getUserDocuments(userId);
      
      // Enhance each document with processed results
      const enhancedDocuments: EnhancedDocument[] = [];
      for (const document of documents) {
        const processedResults = await gcsStorage.getProcessedResults(document.id);
        enhancedDocuments.push({
          ...document,
          simplifiedClauses: processedResults?.simplifiedClauses,
          summary: processedResults?.summary,
          keyTerms: processedResults?.keyTerms
        });
      }
      
      return enhancedDocuments;
    } catch (error) {
      console.error('Error getting user documents:', error);
      return [];
    }
  }

  // File operations
  async uploadDocumentFile(fileBuffer: Buffer, originalName: string, contentType: string): Promise<{ documentId: string; metadata: DocumentMetadata }> {
    try {
      // Upload to GCS first
      const { documentId, metadata } = await gcsStorage.uploadDocument(fileBuffer, originalName, contentType);
      
      // Create Firestore document record
      const firestoreDocument = await firestoreService.createDocument({
        fileName: originalName,
        originalName: originalName,
        contentType: contentType,
        size: fileBuffer.length,
        uploadedAt: new Date(),
        status: 'uploaded',
        gcsDocumentId: documentId
      });

      return {
        documentId: firestoreDocument.id,
        metadata: firestoreDocument
      };
    } catch (error) {
      console.error('Error uploading document file:', error);
      throw error;
    }
  }

  async downloadDocumentFile(documentId: string): Promise<Buffer | null> {
    try {
      // Get document metadata from Firestore
      const document = await firestoreService.getDocument(documentId);
      if (!document || !document.gcsDocumentId) {
        return null;
      }

      // Download from GCS using the stored GCS document ID
      return await gcsStorage.downloadDocument(document.gcsDocumentId);
    } catch (error) {
      console.error('Error downloading document file:', error);
      return null;
    }
  }

  async storeProcessedResults(documentId: string, results: { simplifiedClauses?: SimplifiedClause[]; summary?: string; keyTerms?: string[] }): Promise<void> {
    try {
      // Store results in GCS
      await gcsStorage.storeProcessedResults(documentId, results);
      
      // Update document status in Firestore
      await firestoreService.updateDocument(documentId, {
        status: 'completed',
        processedAt: new Date()
      });
    } catch (error) {
      console.error('Error storing processed results:', error);
      throw error;
    }
  }

  async getProcessedResults(documentId: string): Promise<any | null> {
    try {
      return await gcsStorage.getProcessedResults(documentId);
    } catch (error) {
      console.error('Error getting processed results:', error);
      return null;
    }
  }

  async deleteDocumentFile(documentId: string): Promise<void> {
    try {
      // Get document metadata
      const document = await firestoreService.getDocument(documentId);
      if (!document) return;

      // Delete from GCS if GCS document ID exists
      if (document.gcsDocumentId) {
        await gcsStorage.deleteDocument(document.gcsDocumentId);
      }

      // Update status in Firestore
      await firestoreService.updateDocument(documentId, {
        status: 'deleted'
      });
    } catch (error) {
      console.error('Error deleting document file:', error);
      throw error;
    }
  }

  // Conversation methods
  async getConversation(id: string): Promise<ConversationData | undefined> {
    try {
      return await firestoreService.getConversation(id);
    } catch (error) {
      console.error('Error getting conversation:', error);
      return undefined;
    }
  }

  async createConversation(conversation: Omit<ConversationData, 'id'>): Promise<ConversationData> {
    try {
      return await firestoreService.createConversation(conversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  async getDocumentConversations(documentId: string): Promise<ConversationData[]> {
    try {
      return await firestoreService.getDocumentConversations(documentId);
    } catch (error) {
      console.error('Error getting document conversations:', error);
      return [];
    }
  }

  // Additional utility methods
  async getRecentDocuments(limit: number = 10): Promise<EnhancedDocument[]> {
    try {
      const documents = await firestoreService.getRecentDocuments(limit);
      
      // Enhance each document with processed results
      const enhancedDocuments: EnhancedDocument[] = [];
      for (const document of documents) {
        const processedResults = await gcsStorage.getProcessedResults(document.id);
        enhancedDocuments.push({
          ...document,
          simplifiedClauses: processedResults?.simplifiedClauses,
          summary: processedResults?.summary,
          keyTerms: processedResults?.keyTerms
        });
      }
      
      return enhancedDocuments;
    } catch (error) {
      console.error('Error getting recent documents:', error);
      return [];
    }
  }

  async getDocumentsByStatus(status: DocumentMetadata['status']): Promise<EnhancedDocument[]> {
    try {
      const documents = await firestoreService.getDocumentsByStatus(status);
      
      // Enhance each document with processed results
      const enhancedDocuments: EnhancedDocument[] = [];
      for (const document of documents) {
        const processedResults = await gcsStorage.getProcessedResults(document.id);
        enhancedDocuments.push({
          ...document,
          simplifiedClauses: processedResults?.simplifiedClauses,
          summary: processedResults?.summary,
          keyTerms: processedResults?.keyTerms
        });
      }
      
      return enhancedDocuments;
    } catch (error) {
      console.error('Error getting documents by status:', error);
      return [];
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      return await firestoreService.isHealthy();
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const firestoreEnhancedStorage = new FirestoreEnhancedStorage();
