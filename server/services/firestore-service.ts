import { Firestore, DocumentData, QueryDocumentSnapshot } from '@google-cloud/firestore';
import { firestoreClient } from './google-cloud';

export interface DocumentMetadata {
  id: string;
  fileName: string;
  originalName: string;
  contentType: string;
  size: number;
  uploadedAt: Date;
  processedAt?: Date;
  status: 'uploaded' | 'processing' | 'completed' | 'failed' | 'deleted';
  userId?: string;
  gcsDocumentId?: string;
  error?: string;
}

export interface ConversationData {
  id: string;
  documentId: string;
  question: string;
  answer: string;
  createdAt: Date;
  language?: string;
}

export interface SimplifiedClause {
  id: number;
  title: string;
  simplified: string;
  category: string;
  importance: string;
  color: string;
}

export class FirestoreService {
  private db: Firestore | null;
  private documentsCollection = 'documents';
  private conversationsCollection = 'conversations';

  constructor() {
    this.db = firestoreClient;
  }

  // Document operations
  async createDocument(metadata: Omit<DocumentMetadata, 'id'>): Promise<DocumentMetadata> {
    if (!this.db) {
      throw new Error('Firestore client not initialized');
    }

    const docRef = this.db.collection(this.documentsCollection).doc();
    const documentData: DocumentMetadata = {
      ...metadata,
      id: docRef.id
    };

    // Filter out undefined values before saving to Firestore
    const firestoreData: any = {
      ...documentData,
      uploadedAt: documentData.uploadedAt.toISOString()
    };
    
    // Only include processedAt if it exists
    if (documentData.processedAt) {
      firestoreData.processedAt = documentData.processedAt.toISOString();
    }

    await docRef.set(firestoreData);

    console.log(`✅ Document created in Firestore: ${documentData.id}`);
    return documentData;
  }

  async getDocument(id: string): Promise<DocumentMetadata | null> {
    if (!this.db) {
      throw new Error('Firestore client not initialized');
    }

    try {
      const doc = await this.db.collection(this.documentsCollection).doc(id).get();
      
      if (!doc.exists) {
        return null;
      }

      const data = doc.data() as any;
      return {
        ...data,
        uploadedAt: new Date(data.uploadedAt),
        processedAt: data.processedAt ? new Date(data.processedAt) : undefined
      };
    } catch (error) {
      console.error('Error getting document from Firestore:', error);
      return null;
    }
  }

  async updateDocument(id: string, updates: Partial<DocumentMetadata>): Promise<DocumentMetadata | null> {
    if (!this.db) {
      throw new Error('Firestore client not initialized');
    }

    try {
      const docRef = this.db.collection(this.documentsCollection).doc(id);
      
      // Convert dates to ISO strings for Firestore
      const firestoreUpdates: any = { ...updates };
      if (updates.uploadedAt) {
        firestoreUpdates.uploadedAt = updates.uploadedAt.toISOString();
      }
      if (updates.processedAt) {
        firestoreUpdates.processedAt = updates.processedAt.toISOString();
      }

      await docRef.update(firestoreUpdates);
      
      // Return updated document
      const updatedDoc = await this.getDocument(id);
      console.log(`✅ Document updated in Firestore: ${id}`);
      return updatedDoc;
    } catch (error) {
      console.error('Error updating document in Firestore:', error);
      return null;
    }
  }

  async getUserDocuments(userId: string): Promise<DocumentMetadata[]> {
    if (!this.db) {
      throw new Error('Firestore client not initialized');
    }

    try {
      const snapshot = await this.db
        .collection(this.documentsCollection)
        .where('userId', '==', userId)
        .orderBy('uploadedAt', 'desc')
        .get();

      return snapshot.docs.map(doc => {
        const data = doc.data() as any;
        return {
          ...data,
          uploadedAt: new Date(data.uploadedAt),
          processedAt: data.processedAt ? new Date(data.processedAt) : undefined
        };
      });
    } catch (error) {
      console.error('Error getting user documents from Firestore:', error);
      return [];
    }
  }

  async deleteDocument(id: string): Promise<boolean> {
    if (!this.db) {
      throw new Error('Firestore client not initialized');
    }

    try {
      await this.db.collection(this.documentsCollection).doc(id).delete();
      console.log(`✅ Document deleted from Firestore: ${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting document from Firestore:', error);
      return false;
    }
  }

  // Conversation operations
  async createConversation(conversation: Omit<ConversationData, 'id'>): Promise<ConversationData> {
    if (!this.db) {
      throw new Error('Firestore client not initialized');
    }

    const docRef = this.db.collection(this.conversationsCollection).doc();
    const conversationData: ConversationData = {
      ...conversation,
      id: docRef.id
    };

    await docRef.set({
      ...conversationData,
      createdAt: conversationData.createdAt.toISOString()
    });

    console.log(`✅ Conversation created in Firestore: ${conversationData.id}`);
    return conversationData;
  }

  async getConversation(id: string): Promise<ConversationData | null> {
    if (!this.db) {
      throw new Error('Firestore client not initialized');
    }

    try {
      const doc = await this.db.collection(this.conversationsCollection).doc(id).get();
      
      if (!doc.exists) {
        return null;
      }

      const data = doc.data() as any;
      return {
        ...data,
        createdAt: new Date(data.createdAt)
      };
    } catch (error) {
      console.error('Error getting conversation from Firestore:', error);
      return null;
    }
  }

  async getDocumentConversations(documentId: string): Promise<ConversationData[]> {
    if (!this.db) {
      throw new Error('Firestore client not initialized');
    }

    try {
      const snapshot = await this.db
        .collection(this.conversationsCollection)
        .where('documentId', '==', documentId)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => {
        const data = doc.data() as any;
        return {
          ...data,
          createdAt: new Date(data.createdAt)
        };
      });
    } catch (error) {
      console.error('Error getting document conversations from Firestore:', error);
      return [];
    }
  }

  // Utility methods
  async getDocumentsByStatus(status: DocumentMetadata['status']): Promise<DocumentMetadata[]> {
    if (!this.db) {
      throw new Error('Firestore client not initialized');
    }

    try {
      const snapshot = await this.db
        .collection(this.documentsCollection)
        .where('status', '==', status)
        .orderBy('uploadedAt', 'desc')
        .get();

      return snapshot.docs.map(doc => {
        const data = doc.data() as any;
        return {
          ...data,
          uploadedAt: new Date(data.uploadedAt),
          processedAt: data.processedAt ? new Date(data.processedAt) : undefined
        };
      });
    } catch (error) {
      console.error('Error getting documents by status from Firestore:', error);
      return [];
    }
  }

  async getRecentDocuments(limit: number = 10): Promise<DocumentMetadata[]> {
    if (!this.db) {
      throw new Error('Firestore client not initialized');
    }

    try {
      const snapshot = await this.db
        .collection(this.documentsCollection)
        .orderBy('uploadedAt', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map(doc => {
        const data = doc.data() as any;
        return {
          ...data,
          uploadedAt: new Date(data.uploadedAt),
          processedAt: data.processedAt ? new Date(data.processedAt) : undefined
        };
      });
    } catch (error) {
      console.error('Error getting recent documents from Firestore:', error);
      return [];
    }
  }

  // Health check
  async isHealthy(): Promise<boolean> {
    if (!this.db) {
      return false;
    }

    try {
      // Try to read from a collection to test connectivity
      await this.db.collection('_health').limit(1).get();
      return true;
    } catch (error) {
      console.error('Firestore health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const firestoreService = new FirestoreService();
