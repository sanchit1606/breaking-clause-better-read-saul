const axios = require('axios');

class TTSAgent {
  constructor() {
    this.name = 'TTS Agent';
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

  async execute({ text, language = 'en', voice = 'default' }) {
    try {
      this.status = 'active';
      this.lastActivity = new Date().toISOString();
      
      console.log(`Generating TTS for ${text.length} characters in ${language}...`);
      
      // Try API first, fallback to mock
      try {
        const response = await axios.post(`${this.apiBaseUrl}/api/tts`, {
          text: text,
          language: language
        });

        if (response.data.audioUrl) {
          this.status = 'ready';
          return {
            text,
            language,
            voice,
            audioUrl: response.data.audioUrl,
            duration: Math.ceil(text.length / 10),
            format: 'mp3',
            source: 'api'
          };
        }
      } catch (apiError) {
        console.log('API TTS failed, using mock TTS');
      }
      
      // Fallback to mock TTS
      const audioUrl = this.generateMockAudioUrl(text, language);
      
      this.status = 'ready';
      
      return {
        text,
        language,
        voice,
        audioUrl,
        duration: Math.ceil(text.length / 10), // Mock duration in seconds
        format: 'mp3',
        source: 'mock'
      };
    } catch (error) {
      this.status = 'error';
      console.error('TTS Agent error:', error);
      throw new Error(`TTS generation failed: ${error.message}`);
    }
  }

  generateMockAudioUrl(text, language) {
    // Generate a mock audio URL
    // In production, this would return actual audio file URLs from cloud storage
    
    // Simple base64 encoded audio data for demo
    const mockAudioData = 'UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+HyvGcVGRw';
    
    return `data:audio/wav;base64,${mockAudioData}`;
  }

  getSupportedLanguages() {
    return [
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'Hindi' },
      { code: 'ta', name: 'Tamil' },
      { code: 'bn', name: 'Bengali' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' }
    ];
  }

  getSupportedVoices(language = 'en') {
    const voices = {
      'en': ['male', 'female', 'neutral'],
      'hi': ['male', 'female'],
      'ta': ['male', 'female'],
      'bn': ['male', 'female'],
      'es': ['male', 'female'],
      'fr': ['male', 'female']
    };
    
    return voices[language] || ['default'];
  }
}

module.exports = TTSAgent;
