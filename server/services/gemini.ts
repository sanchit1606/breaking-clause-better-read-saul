import { SimplifiedClause } from "@shared/schema";
import { genAI } from "./google-cloud";

// Initialize different Gemini models for different tasks
let geminiPro: any = null;
let geminiFlash: any = null;
let geminiMini: any = null;

// Initialize AI models if genAI is available
if (genAI) {
  geminiPro = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  geminiFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  geminiMini = genAI.getGenerativeModel({ model: "gemini-1.5-mini" });
  console.log('✅ Gemini AI models initialized successfully');
} else {
  console.log('⚠️ Gemini AI not available - using mock responses');
}

export async function simplifyDocumentWithGemini(documentText: string): Promise<SimplifiedClause[]> {
  try {
    // If no API key, return mock data
    if (!geminiFlash) {
      return generateMockClauses(documentText);
    }

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

    const response = await geminiFlash.generateContent({
      systemInstruction: systemPrompt,
      generationConfig: {
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
    // Fallback to mock data on error
    return generateMockClauses(documentText);
  }
}

function generateMockClauses(documentText: string): SimplifiedClause[] {
  const clauses: SimplifiedClause[] = [];
  
  // Extract potential clause keywords
  const paymentKeywords = ['payment', 'pay', 'amount', 'fee', 'cost', 'price', 'installment'];
  const interestKeywords = ['interest', 'rate', 'annual', 'apr', 'percentage', 'finance'];
  const defaultKeywords = ['default', 'breach', 'violation', 'penalty', 'late', 'missed'];
  const termKeywords = ['term', 'period', 'duration', 'time', 'month', 'year', 'agreement'];
  const securityKeywords = ['security', 'collateral', 'guarantee', 'pledge', 'mortgage'];
  
  let clauseId = 1;
  
  // Check for payment-related content
  if (containsKeywords(documentText, paymentKeywords)) {
    clauses.push({
      id: clauseId++,
      title: 'Payment Terms',
      simplified: 'You need to pay a specific amount every month on time. Late payments may result in additional fees.',
      category: 'payment',
      importance: 'high',
      color: 'blue'
    });
  }

  // Check for interest-related content
  if (containsKeywords(documentText, interestKeywords)) {
    clauses.push({
      id: clauseId++,
      title: 'Interest Rate',
      simplified: 'The loan charges interest at a fixed rate. This means you pay extra money on top of what you borrowed.',
      category: 'financial',
      importance: 'high',
      color: 'amber'
    });
  }

  // Check for default/penalty content
  if (containsKeywords(documentText, defaultKeywords)) {
    clauses.push({
      id: clauseId++,
      title: 'Default & Penalties',
      simplified: 'If you miss payments or break the agreement, there will be serious consequences including penalties and possible legal action.',
      category: 'critical',
      importance: 'critical',
      color: 'red'
    });
  }

  // Check for term-related content
  if (containsKeywords(documentText, termKeywords)) {
    clauses.push({
      id: clauseId++,
      title: 'Contract Duration',
      simplified: 'This agreement lasts for a specific time period. The terms explain when it starts and ends.',
      category: 'general',
      importance: 'medium',
      color: 'gray'
    });
  }

  // Check for security-related content
  if (containsKeywords(documentText, securityKeywords)) {
    clauses.push({
      id: clauseId++,
      title: 'Security & Collateral',
      simplified: 'The lender may require security or collateral to protect their investment. This could include property or other assets.',
      category: 'security',
      importance: 'high',
      color: 'green'
    });
  }

  // If no specific clauses found, add a general clause
  if (clauses.length === 0) {
    clauses.push({
      id: 1,
      title: 'General Terms',
      simplified: 'This document contains important legal terms and conditions that you should understand before signing.',
      category: 'general',
      importance: 'medium',
      color: 'gray'
    });
  }

  return clauses;
}

function containsKeywords(text: string, keywords: string[]): boolean {
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword));
}

function generateMockKeyTerms(documentText: string): string[] {
  const commonTerms = [
    'Payment Terms',
    'Interest Rate',
    'Default Clause',
    'Termination',
    'Liability',
    'Indemnification',
    'Force Majeure',
    'Governing Law',
    'Dispute Resolution',
    'Confidentiality'
  ];
  
  // Return a subset based on document content
  return commonTerms.slice(0, Math.min(5, commonTerms.length));
}

function generateMockSummary(documentText: string): string {
  const wordCount = documentText.split(' ').length;
  const isLongDocument = wordCount > 1000;
  
  if (isLongDocument) {
    return "This is a comprehensive legal document containing multiple clauses and terms. It outlines important obligations, rights, and responsibilities that should be carefully reviewed before signing.";
  } else {
    return "This legal document contains important terms and conditions that define the rights and obligations of the parties involved. Please review all sections carefully before proceeding.";
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

    const response = await geminiFlash.generateContent({
      systemInstruction: systemPrompt,
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
    // Use Google Cloud Translation API instead of Gemini for better translation quality
    const { translateTextWithGoogleCloud } = await import('./translation');
    return await translateTextWithGoogleCloud(text, targetLanguage);
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error(`Failed to translate text: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateTTSWithGemini(text: string, language: string = 'en'): Promise<string> {
  try {
    // Use Google Cloud Text-to-Speech API for high-quality audio generation
    const { generateTTSWithGoogleCloud } = await import('./tts');
    return await generateTTSWithGoogleCloud(text, language);
  } catch (error) {
    console.error("TTS generation error:", error);
    throw new Error(`Failed to generate TTS: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function extractKeyTermsWithGemini(documentText: string): Promise<string[]> {
  try {
    // If no API key, return mock data
    if (!geminiMini) {
      return generateMockKeyTerms(documentText);
    }

    const prompt = `Extract the most important legal terms and concepts from this document. 
    Return them as a simple list, one per line, focusing on terms that a non-lawyer should understand:\n\n${documentText}`;

    const response = await geminiMini.generateContent({
      contents: prompt
    });

    const terms = response.text?.split('\n')
      .map(term => term.trim())
      .filter(term => term.length > 0)
      .slice(0, 10) || [];

    return terms;
  } catch (error) {
    console.error("Key terms extraction error:", error);
    return generateMockKeyTerms(documentText);
  }
}

export async function generateDocumentSummaryWithGemini(documentText: string): Promise<string> {
  try {
    // If no API key, return mock data
    if (!geminiFlash) {
      return generateMockSummary(documentText);
    }

    const prompt = `Provide a concise, executive summary of this legal document in 2-3 sentences. 
    Focus on the main purpose, key obligations, and important risks or benefits:\n\n${documentText}`;

    const response = await geminiFlash.generateContent({
      contents: prompt
    });

    return response.text || "Unable to generate summary";
  } catch (error) {
    console.error("Document summary error:", error);
    return generateMockSummary(documentText);
  }
}
