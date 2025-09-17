import { apiRequest } from "./queryClient";

export interface UploadResponse {
  documentId: string;
  message: string;
}

export interface SimplificationResponse {
  clauses: Array<{
    id: number;
    title: string;
    simplified: string;
    category: string;
    importance: "low" | "medium" | "high" | "critical";
    color: string;
  }>;
}

export interface QAResponse {
  answer: string;
  relevantClauses: number[];
}

export interface TranslationResponse {
  translatedText: string;
  language: string;
}

export interface TTSResponse {
  audioUrl: string;
}

export const uploadDocument = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }
  
  return response.json();
};

export const simplifyDocument = async (documentId: string): Promise<SimplificationResponse> => {
  const response = await apiRequest("POST", "/api/simplify", { documentId });
  return response.json();
};

export const askQuestion = async (documentId: string, question: string): Promise<QAResponse> => {
  const response = await apiRequest("POST", "/api/qa", { documentId, question });
  return response.json();
};

export const translateText = async (text: string, targetLanguage: string): Promise<TranslationResponse> => {
  const response = await apiRequest("POST", "/api/translate", { text, targetLanguage });
  return response.json();
};

export const generateTTS = async (text: string, language: string = "en"): Promise<TTSResponse> => {
  const response = await apiRequest("POST", "/api/tts", { text, language });
  return response.json();
};

export const getAgentStatus = async () => {
  const response = await apiRequest("GET", "/api/agents/status", {});
  return response.json();
};
