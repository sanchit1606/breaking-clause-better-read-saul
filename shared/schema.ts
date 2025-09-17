import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  fileName: text("file_name").notNull(),
  originalText: text("original_text"),
  simplifiedClauses: jsonb("simplified_clauses"),
  embeddings: jsonb("embeddings"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  processedAt: timestamp("processed_at"),
  status: text("status").default("uploaded"), // uploaded, processing, completed, failed
});

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  documentId: varchar("document_id").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  language: text("language").default("en"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true,
  processedAt: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Conversation = typeof conversations.$inferSelect;
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
