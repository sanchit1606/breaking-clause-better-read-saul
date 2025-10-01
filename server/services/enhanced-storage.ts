import { type User, type InsertUser, type Document, type InsertDocument, type Conversation, type InsertConversation, type SimplifiedClause, users, documents, conversations } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { gcsStorage, DocumentMetadata } from "./gcs-storage";

export interface EnhancedDocument extends Document {
  originalText?: string;
  simplifiedClauses?: SimplifiedClause[];
  summary?: string;
  keyTerms?: string[];
  gcsMetadata?: DocumentMetadata;
}

export interface IEnhancedStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Document methods
  getDocument(id: string): Promise<EnhancedDocument | undefined>;
  createDocument(document: InsertDocument): Promise<EnhancedDocument>;
  updateDocument(id: string, updates: Partial<Document>): Promise<EnhancedDocument | undefined>;
  getUserDocuments(userId: string): Promise<EnhancedDocument[]>;

  // File operations
  uploadDocumentFile(fileBuffer: Buffer, originalName: string, contentType: string): Promise<{ documentId: string; metadata: DocumentMetadata }>;
  downloadDocumentFile(documentId: string): Promise<Buffer | null>;
  storeProcessedResults(documentId: string, results: { simplifiedClauses?: SimplifiedClause[]; summary?: string; keyTerms?: string[] }): Promise<void>;
  getProcessedResults(documentId: string): Promise<any | null>;
  deleteDocumentFile(documentId: string): Promise<void>;

  // Conversation methods
  getConversation(id: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getDocumentConversations(documentId: string): Promise<Conversation[]>;
}

export class EnhancedStorage implements IEnhancedStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Document methods
  async getDocument(id: string): Promise<EnhancedDocument | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    if (!document) return undefined;

    // Get processed results from GCS
    const processedResults = await gcsStorage.getProcessedResults(id);
    
    return {
      ...document,
      simplifiedClauses: processedResults?.simplifiedClauses,
      summary: processedResults?.summary,
      keyTerms: processedResults?.keyTerms,
      gcsMetadata: processedResults?.metadata
    };
  }

  async createDocument(insertDocument: InsertDocument): Promise<EnhancedDocument> {
    const [document] = await db
      .insert(documents)
      .values({
        ...insertDocument,
        userId: insertDocument.userId ?? null,
        uploadedAt: new Date(),
        processedAt: null,
        status: "uploaded"
      })
      .returning();
    
    return document as EnhancedDocument;
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<EnhancedDocument | undefined> {
    const [document] = await db
      .update(documents)
      .set(updates)
      .where(eq(documents.id, id))
      .returning();
    
    if (!document) return undefined;

    // Get processed results from GCS
    const processedResults = await gcsStorage.getProcessedResults(id);
    
    return {
      ...document,
      simplifiedClauses: processedResults?.simplifiedClauses,
      summary: processedResults?.summary,
      keyTerms: processedResults?.keyTerms,
      gcsMetadata: processedResults?.metadata
    };
  }

  async getUserDocuments(userId: string): Promise<EnhancedDocument[]> {
    const dbDocuments = await db.select().from(documents).where(eq(documents.userId, userId));
    
    // Enhance each document with processed results
    const enhancedDocuments: EnhancedDocument[] = [];
    for (const document of dbDocuments) {
      const processedResults = await gcsStorage.getProcessedResults(document.id);
      enhancedDocuments.push({
        ...document,
        simplifiedClauses: processedResults?.simplifiedClauses,
        summary: processedResults?.summary,
        keyTerms: processedResults?.keyTerms,
        gcsMetadata: processedResults?.metadata
      });
    }
    
    return enhancedDocuments;
  }

  // File operations
  async uploadDocumentFile(fileBuffer: Buffer, originalName: string, contentType: string): Promise<{ documentId: string; metadata: DocumentMetadata }> {
    return await gcsStorage.uploadDocument(fileBuffer, originalName, contentType);
  }

  async downloadDocumentFile(documentId: string): Promise<Buffer | null> {
    return await gcsStorage.downloadDocument(documentId);
  }

  async storeProcessedResults(documentId: string, results: { simplifiedClauses?: SimplifiedClause[]; summary?: string; keyTerms?: string[] }): Promise<void> {
    await gcsStorage.storeProcessedResults(documentId, results);
    
    // Update document status in database
    await this.updateDocument(documentId, {
      status: "processed",
      processedAt: new Date()
    });
  }

  async getProcessedResults(documentId: string): Promise<any | null> {
    return await gcsStorage.getProcessedResults(documentId);
  }

  async deleteDocumentFile(documentId: string): Promise<void> {
    await gcsStorage.deleteDocument(documentId);
    
    // Update document status in database
    await this.updateDocument(documentId, {
      status: "deleted"
    });
  }

  // Conversation methods
  async getConversation(id: string): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation || undefined;
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const [conversation] = await db
      .insert(conversations)
      .values({
        ...insertConversation,
        language: insertConversation.language ?? null,
        createdAt: new Date()
      })
      .returning();
    return conversation;
  }

  async getDocumentConversations(documentId: string): Promise<Conversation[]> {
    return await db.select().from(conversations).where(eq(conversations.documentId, documentId));
  }
}

// Export singleton instance
export const enhancedStorage = new EnhancedStorage();
