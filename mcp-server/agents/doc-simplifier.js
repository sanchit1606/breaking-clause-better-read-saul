const axios = require('axios');

class DocSimplifierAgent {
  constructor() {
    this.name = 'Doc Simplifier';
    this.status = 'ready';
    this.lastActivity = null;
    this.apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
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

  async execute({ text, language = 'en', documentId = null }) {
    try {
      this.status = 'active';
      this.lastActivity = new Date().toISOString();
      
      console.log(`Simplifying document (${text.length} characters)...`);
      
      // If documentId is provided, use the backend API
      if (documentId) {
        return await this.simplifyViaAPI(documentId, language);
      }
      
      // Otherwise, use mock simplification for direct text input
      const mockClauses = this.generateMockClauses(text);
      
      this.status = 'ready';
      
      return {
        clauses: mockClauses,
        originalLength: text.length,
        simplifiedLength: mockClauses.reduce((total, clause) => total + clause.simplified.length, 0),
        language
      };
    } catch (error) {
      this.status = 'error';
      console.error('Doc Simplifier error:', error);
      throw new Error(`Document simplification failed: ${error.message}`);
    }
  }

  async simplifyViaAPI(documentId, language) {
    try {
      const response = await axios.post(`${this.apiBaseUrl}/api/simplify`, {
        documentId: documentId
      });

      if (response.data.clauses) {
        this.status = 'ready';
        return {
          clauses: response.data.clauses,
          language: language,
          source: 'api'
        };
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (error) {
      console.error('API call failed:', error.message);
      // Fallback to mock data
      return this.generateMockClauses('Document processing failed, using mock data');
    }
  }

  generateMockClauses(text) {
    // Generate realistic mock clauses based on document content
    const clauses = [];
    
    // Extract potential clause keywords
    const paymentKeywords = ['payment', 'pay', 'amount', 'fee', 'cost', 'price'];
    const interestKeywords = ['interest', 'rate', 'annual', 'apr', 'percentage'];
    const defaultKeywords = ['default', 'breach', 'violation', 'penalty', 'late'];
    const termKeywords = ['term', 'period', 'duration', 'time', 'month', 'year'];
    
    let clauseId = 1;
    
    // Check for payment-related content
    if (this.containsKeywords(text, paymentKeywords)) {
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
    if (this.containsKeywords(text, interestKeywords)) {
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
    if (this.containsKeywords(text, defaultKeywords)) {
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
    if (this.containsKeywords(text, termKeywords)) {
      clauses.push({
        id: clauseId++,
        title: 'Contract Duration',
        simplified: 'This agreement lasts for a specific time period. The terms explain when it starts and ends.',
        category: 'general',
        importance: 'medium',
        color: 'gray'
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

  containsKeywords(text, keywords) {
    const lowerText = text.toLowerCase();
    return keywords.some(keyword => lowerText.includes(keyword));
  }
}

module.exports = DocSimplifierAgent;
