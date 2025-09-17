import { SimplifiedClause } from "@shared/schema";
import { storage } from "../storage";

// Mock vector embeddings and search for MVP
// In production, this would use Pinecone or similar vector DB

interface ClauseEmbedding {
  id: number;
  title: string;
  content: string;
  embedding: number[]; // Mock embedding vector
  documentId: string;
}

// Simple mock embeddings storage
const embeddings = new Map<string, ClauseEmbedding[]>();

export async function createEmbeddings(documentId: string, clauses: SimplifiedClause[]) {
  const clauseEmbeddings = clauses.map(clause => ({
    id: clause.id,
    title: clause.title,
    content: clause.simplified,
    embedding: generateMockEmbedding(clause.simplified),
    documentId
  }));

  embeddings.set(documentId, clauseEmbeddings);
  return clauseEmbeddings;
}

export async function searchSimilarClauses(query: string, documentId: string, limit: number = 3): Promise<SimplifiedClause[]> {
  const documentEmbeddings = embeddings.get(documentId);
  if (!documentEmbeddings) {
    return [];
  }

  // Mock similarity search based on keyword matching
  // In production, this would use actual vector similarity
  const queryWords = query.toLowerCase().split(' ');
  
  const scoredClauses = documentEmbeddings.map(clause => {
    const content = clause.content.toLowerCase();
    const title = clause.title.toLowerCase();
    
    let score = 0;
    queryWords.forEach(word => {
      if (content.includes(word)) score += 2;
      if (title.includes(word)) score += 3;
    });

    return { clause, score };
  });

  // Sort by score and return top results
  const topClauses = scoredClauses
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => ({
      id: item.clause.id,
      title: item.clause.title,
      simplified: item.clause.content,
      category: "relevant", // Mock category
      importance: "medium" as const,
      color: "blue"
    }));

  return topClauses;
}

function generateMockEmbedding(text: string): number[] {
  // Generate a simple mock embedding based on text content
  // In production, this would use Sentence Transformers or similar
  const embedding = new Array(384).fill(0); // Mock 384-dimensional embedding
  
  for (let i = 0; i < text.length && i < 384; i++) {
    embedding[i] = (text.charCodeAt(i) / 255) - 0.5;
  }
  
  return embedding;
}

export async function storeEmbeddings(documentId: string, embeddings: any[]) {
  // In production, this would store embeddings in Pinecone
  const document = await storage.getDocument(documentId);
  if (document) {
    await storage.updateDocument(documentId, {
      embeddings: embeddings
    });
  }
}
