import { type User, type InsertUser, type Document, type InsertDocument, type Conversation, type InsertConversation, type SimplifiedClause } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Document methods
  getDocument(id: string): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: string, updates: Partial<Document>): Promise<Document | undefined>;
  getUserDocuments(userId: string): Promise<Document[]>;

  // Conversation methods
  getConversation(id: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getDocumentConversations(documentId: string): Promise<Conversation[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private documents: Map<string, Document>;
  private conversations: Map<string, Conversation>;

  constructor() {
    this.users = new Map();
    this.documents = new Map();
    this.conversations = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Document methods
  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const document: Document = {
      ...insertDocument,
      id,
      uploadedAt: new Date(),
      processedAt: null,
      status: "uploaded",
      userId: insertDocument.userId ?? null
    };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) return undefined;

    const updatedDocument = { ...document, ...updates };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }

  async getUserDocuments(userId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (document) => document.userId === userId
    );
  }

  // Conversation methods
  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const conversation: Conversation = {
      ...insertConversation,
      id,
      createdAt: new Date(),
      language: insertConversation.language ?? null
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getDocumentConversations(documentId: string): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).filter(
      (conversation) => conversation.documentId === documentId
    );
  }
}

// Firestore storage implementation
export class DatabaseStorage implements IStorage {
  // User methods - Note: User management not implemented in Firestore service yet
  async getUser(id: string): Promise<User | undefined> {
    // TODO: Implement user management in Firestore
    throw new Error('User management not implemented yet');
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // TODO: Implement user management in Firestore
    throw new Error('User management not implemented yet');
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // TODO: Implement user management in Firestore
    throw new Error('User management not implemented yet');
  }

  // Document methods - delegate to Firestore service
  async getDocument(id: string): Promise<Document | undefined> {
    return await db.getDocument(id);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const documentData = {
      fileName: insertDocument.fileName,
      originalName: insertDocument.originalName,
      contentType: insertDocument.contentType,
      size: insertDocument.size,
      originalText: insertDocument.originalText,
      status: insertDocument.status || 'uploaded',
      userId: insertDocument.userId,
      gcsDocumentId: insertDocument.gcsDocumentId,
      uploadedAt: new Date(),
      processedAt: insertDocument.processedAt,
      error: insertDocument.error
    };
    
    return await db.createDocument(documentData);
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document | undefined> {
    return await db.updateDocument(id, updates);
  }

  async getUserDocuments(userId: string): Promise<Document[]> {
    return await db.getUserDocuments(userId);
  }

  // Conversation methods - delegate to Firestore service
  async getConversation(id: string): Promise<Conversation | undefined> {
    return await db.getConversation(id);
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const conversationData = {
      documentId: insertConversation.documentId,
      question: insertConversation.question,
      answer: insertConversation.answer,
      language: insertConversation.language,
      createdAt: new Date()
    };
    
    return await db.createConversation(conversationData);
  }

  async getDocumentConversations(documentId: string): Promise<Conversation[]> {
    return await db.getDocumentConversations(documentId);
  }
}

export const storage = new DatabaseStorage();
