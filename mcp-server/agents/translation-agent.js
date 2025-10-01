const axios = require('axios');

class TranslationAgent {
  constructor() {
    this.name = 'Translation Agent';
    this.status = 'ready';
    this.lastActivity = null;
    this.apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
    
    // Language mappings
    this.languages = {
      'en': 'English',
      'hi': 'Hindi',
      'ta': 'Tamil',
      'bn': 'Bengali',
      'es': 'Spanish',
      'fr': 'French'
    };
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

  async execute({ text, targetLanguage }) {
    try {
      this.status = 'active';
      this.lastActivity = new Date().toISOString();
      
      console.log(`Translating to ${this.languages[targetLanguage] || targetLanguage}...`);
      
      // Try API first, fallback to mock
      try {
        const response = await axios.post(`${this.apiBaseUrl}/api/translate`, {
          text: text,
          targetLanguage: targetLanguage
        });

        if (response.data.translatedText) {
          this.status = 'ready';
          return {
            originalText: text,
            translatedText: response.data.translatedText,
            sourceLanguage: 'en',
            targetLanguage,
            confidence: 0.95,
            source: 'api'
          };
        }
      } catch (apiError) {
        console.log('API translation failed, using mock translation');
      }
      
      // Fallback to mock translation
      const translatedText = this.generateMockTranslation(text, targetLanguage);
      
      this.status = 'ready';
      
      return {
        originalText: text,
        translatedText,
        sourceLanguage: 'en',
        targetLanguage,
        confidence: 0.92,
        source: 'mock'
      };
    } catch (error) {
      this.status = 'error';
      console.error('Translation Agent error:', error);
      throw new Error(`Translation failed: ${error.message}`);
    }
  }

  generateMockTranslation(text, targetLanguage) {
    // Mock translations for demo purposes
    // In production, this would call actual translation APIs
    
    const mockTranslations = {
      'hi': {
        'Payment Terms': 'भुगतान की शर्तें',
        'Interest Rate': 'ब्याज दर',
        'Default & Penalties': 'डिफ़ॉल्ट और दंड',
        'You need to pay': 'आपको भुगतान करना होगा',
        'This means': 'इसका मतलब है',
        'If you miss': 'यदि आप चूक जाते हैं'
      },
      'ta': {
        'Payment Terms': 'பணம் செலுத்தும் நிபந்தனைகள்',
        'Interest Rate': 'வட்டி விகிதம்',
        'Default & Penalties': 'இயல்புநிலை மற்றும் அபராதங்கள்',
        'You need to pay': 'நீங்கள் செலுத்த வேண்டும்',
        'This means': 'இதன் பொருள்',
        'If you miss': 'நீங்கள் தவறவிட்டால்'
      },
      'bn': {
        'Payment Terms': 'পেমেন্ট শর্তাবলী',
        'Interest Rate': 'সুদের হার',
        'Default & Penalties': 'ডিফল্ট এবং জরিমানা',
        'You need to pay': 'আপনাকে পেমেন্ট করতে হবে',
        'This means': 'এর অর্থ হল',
        'If you miss': 'যদি আপনি মিস করেন'
      }
    };

    if (!mockTranslations[targetLanguage]) {
      // For unsupported languages, return with language prefix
      return `[${targetLanguage.toUpperCase()}] ${text}`;
    }

    let translatedText = text;
    
    // Apply mock translations
    Object.entries(mockTranslations[targetLanguage]).forEach(([english, translated]) => {
      translatedText = translatedText.replace(new RegExp(english, 'gi'), translated);
    });

    return translatedText;
  }

  getSupportedLanguages() {
    return this.languages;
  }
}

module.exports = TranslationAgent;
