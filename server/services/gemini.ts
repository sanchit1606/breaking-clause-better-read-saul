import { GoogleGenAI } from "@google/genai";
import { SimplifiedClause } from "@shared/schema";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "" 
});

export async function simplifyDocumentWithGemini(documentText: string): Promise<SimplifiedClause[]> {
  try {
    const systemPrompt = `You are a legal document simplification expert. 
Analyze the given legal document and break it down into simplified clauses.
Each clause should be explained in plain, everyday language that a non-lawyer can understand.

Categorize each clause as: payment, financial, critical, security, or general
Set importance as: low, medium, high, or critical
Assign appropriate colors: blue (payment), amber (financial), red (critical), green (security), gray (general)

Respond with JSON in this exact format:
{
  "clauses": [
    {
      "id": number,
      "title": "string",
      "simplified": "string", 
      "category": "string",
      "importance": "string",
      "color": "string"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            clauses: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  title: { type: "string" },
                  simplified: { type: "string" },
                  category: { type: "string" },
                  importance: { type: "string" },
                  color: { type: "string" }
                },
                required: ["id", "title", "simplified", "category", "importance", "color"]
              }
            }
          },
          required: ["clauses"]
        }
      },
      contents: `Please simplify this legal document:\n\n${documentText}`
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from Gemini");
    }

    const result = JSON.parse(rawJson);
    return result.clauses || [];
  } catch (error) {
    console.error("Gemini simplification error:", error);
    throw new Error(`Failed to simplify document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function askQuestionWithGemini(
  question: string, 
  documentText: string, 
  relevantClauses: SimplifiedClause[]
): Promise<string> {
  try {
    const systemPrompt = `You are a legal document Q&A assistant. 
Answer questions about legal documents in simple, clear language.
Use the provided document text and relevant clauses to give accurate, helpful answers.
Always explain legal terms in plain English and provide practical implications.`;

    const contextText = relevantClauses.length > 0 
      ? `Relevant clauses:\n${relevantClauses.map(c => `${c.title}: ${c.simplified}`).join('\n\n')}\n\n`
      : '';

    const prompt = `${contextText}Document text:\n${documentText}\n\nQuestion: ${question}\n\nPlease provide a clear, helpful answer in plain language:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt
      },
      contents: prompt
    });

    return response.text || "I couldn't generate an answer to your question. Please try rephrasing it.";
  } catch (error) {
    console.error("Gemini Q&A error:", error);
    throw new Error(`Failed to answer question: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function translateTextWithGemini(text: string, targetLanguage: string): Promise<string> {
  try {
    const languageNames: Record<string, string> = {
      'hi': 'Hindi',
      'ta': 'Tamil', 
      'bn': 'Bengali',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese'
    };

    const targetLangName = languageNames[targetLanguage] || targetLanguage;

    const prompt = `Translate the following text to ${targetLangName}. Maintain the meaning and tone, especially for legal or formal content:\n\n${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    return response.text || text; // Fallback to original text if translation fails
  } catch (error) {
    console.error("Gemini translation error:", error);
    throw new Error(`Failed to translate text: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
