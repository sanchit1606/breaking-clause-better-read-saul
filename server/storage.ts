import { type User, type InsertUser, type Document, type InsertDocument, type Conversation, type InsertConversation, type SimplifiedClause, users, documents, conversations } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";

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

// Database storage implementation
export class DatabaseStorage implements IStorage {
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
  async getDocument(id: string): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document || undefined;
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
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
    return document;
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document | undefined> {
    const [document] = await db
      .update(documents)
      .set(updates)
      .where(eq(documents.id, id))
      .returning();
    return document || undefined;
  }

  async getUserDocuments(userId: string): Promise<Document[]> {
    return await db.select().from(documents).where(eq(documents.userId, userId));
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

export const storage = new DatabaseStorage();
