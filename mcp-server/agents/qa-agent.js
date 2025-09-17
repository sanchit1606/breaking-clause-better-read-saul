const axios = require('axios');

class QAAgent {
  constructor() {
    this.name = 'Q&A Agent';
    this.status = 'ready';
    this.lastActivity = null;
  }

  getName() {
    return this.name;
  }

  getStatus() {
    return this.status;
  }

  getLastActivity() {
    return this.lastActivity;
  }

  async execute({ question, documentText, language = 'en' }) {
    try {
      this.status = 'active';
      this.lastActivity = new Date().toISOString();
      
      console.log(`Processing Q&A: "${question}"`);
      
      // Mock Q&A logic
      // In production, this would use Gemini and vector search
      const answer = this.generateMockAnswer(question, documentText);
      const relevantClauses = this.findRelevantClauses(question);
      
      this.status = 'ready';
      
      return {
        question,
        answer,
        relevantClauses,
        confidence: 0.85,
        language
      };
    } catch (error) {
      this.status = 'error';
      console.error('Q&A Agent error:', error);
      throw new Error(`Q&A processing failed: ${error.message}`);
    }
  }

  generateMockAnswer(question, documentText) {
    const lowerQuestion = question.toLowerCase();
    
    // Payment-related questions
    if (lowerQuestion.includes('payment') || lowerQuestion.includes('pay')) {
      return 'Based on your document, you are required to make regular payments as specified in the payment terms. Missing payments may result in late fees and other penalties. Please check the specific payment schedule in your contract.';
    }
    
    // Interest-related questions
    if (lowerQuestion.includes('interest') || lowerQuestion.includes('rate')) {
      return 'The document specifies an interest rate that will be applied to your loan or agreement. This rate determines how much extra you will pay over time. The exact percentage should be clearly stated in your contract.';
    }
    
    // Default/penalty questions
    if (lowerQuestion.includes('miss') || lowerQuestion.includes('late') || lowerQuestion.includes('penalty')) {
      return 'If you miss payments or violate the terms of your agreement, there are serious consequences. This typically includes late fees, penalty charges, and potentially acceleration of the entire debt. The document should specify the exact penalties.';
    }
    
    // Termination/cancellation questions
    if (lowerQuestion.includes('cancel') || lowerQuestion.includes('terminate') || lowerQuestion.includes('end')) {
      return 'The document should contain specific terms about how and when the agreement can be terminated or cancelled. This may include notice periods, cancellation fees, and conditions under which either party can end the agreement.';
    }
    
    // Liability/responsibility questions
    if (lowerQuestion.includes('liable') || lowerQuestion.includes('responsible') || lowerQuestion.includes('obligation')) {
      return 'Your document outlines your specific obligations and responsibilities. This includes what you must do, what you cannot do, and what happens if you fail to meet these obligations. Please review the terms carefully.';
    }
    
    // Default answer
    return 'I understand you\'re asking about specific terms in your document. While I can see this is an important question, I recommend reviewing the relevant sections of your contract carefully. If you need clarification on specific clauses, please point me to the exact section you\'re concerned about.';
  }

  findRelevantClauses(question) {
    const lowerQuestion = question.toLowerCase();
    const relevantClauses = [];
    
    if (lowerQuestion.includes('payment') || lowerQuestion.includes('pay')) {
      relevantClauses.push(1); // Payment terms clause
    }
    
    if (lowerQuestion.includes('interest') || lowerQuestion.includes('rate')) {
      relevantClauses.push(2); // Interest rate clause
    }
    
    if (lowerQuestion.includes('miss') || lowerQuestion.includes('late') || lowerQuestion.includes('penalty')) {
      relevantClauses.push(3); // Default & penalties clause
    }
    
    return relevantClauses;
  }
}

module.exports = QAAgent;
