import { z } from "zod";

// Firestore-based types (no Drizzle ORM needed)
export interface User {
  id: string;
  username: string;
  password: string;
}

export interface Document {
  id: string;
  userId?: string;
  fileName: string;
  originalName?: string;
  contentType?: string;
  size?: number;
  originalText?: string;
  simplifiedClauses?: SimplifiedClause[];
  embeddings?: any[];
  summary?: string;
  keyTerms?: string[];
  error?: string;
  uploadedAt: Date;
  processedAt?: Date;
  status: 'uploaded' | 'processing' | 'completed' | 'failed' | 'deleted';
  gcsDocumentId?: string;
}

export interface Conversation {
  id: string;
  documentId: string;
  question: string;
  answer: string;
  language?: string;
  createdAt: Date;
}

// Zod schemas for validation
export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const insertDocumentSchema = z.object({
  userId: z.string().optional(),
  fileName: z.string().min(1),
  originalName: z.string().optional(),
  contentType: z.string().optional(),
  size: z.number().optional(),
  originalText: z.string().optional(),
  simplifiedClauses: z.array(z.any()).optional(),
  embeddings: z.array(z.any()).optional(),
  summary: z.string().optional(),
  keyTerms: z.array(z.string()).optional(),
  error: z.string().optional(),
  status: z.enum(['uploaded', 'processing', 'completed', 'failed', 'deleted']).optional(),
  gcsDocumentId: z.string().optional(),
});

export const insertConversationSchema = z.object({
  documentId: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
  language: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

export interface SimplifiedClause {
  id: number;
  title: string;
  simplified: string;
  category: string;
  importance: "low" | "medium" | "high" | "critical";
  color: string;
}

export interface AgentStatus {
  name: string;
  status: "active" | "ready" | "standby" | "error";
}

export interface QAMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  language?: string;
}
