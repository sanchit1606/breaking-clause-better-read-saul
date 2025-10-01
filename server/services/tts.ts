import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { ttsClient } from "./google-cloud";

export async function generateTTSWithGoogleCloud(text: string, language: string = 'en'): Promise<string> {
  try {
    if (!ttsClient) {
      console.log('TTS client not available, falling back to mock TTS');
      return generateMockTTS(text, language);
    }

    // Configure the request
    const request = {
      input: { text: text },
      voice: {
        languageCode: getLanguageCode(language),
        name: getVoiceName(language),
        ssmlGender: 'NEUTRAL' as const,
      },
      audioConfig: {
        audioEncoding: 'MP3' as const,
      },
    };

    // Perform the text-to-speech request
    const [response] = await ttsClient.synthesizeSpeech(request);
    
    if (response.audioContent) {
      // Convert the audio content to base64 data URL
      const audioBuffer = Buffer.from(response.audioContent);
      const base64Audio = audioBuffer.toString('base64');
      return `data:audio/mp3;base64,${base64Audio}`;
    } else {
      throw new Error('No audio content received from TTS service');
    }
  } catch (error) {
    console.error("Google Cloud TTS error:", error);
    console.log('Falling back to mock TTS');
    return generateMockTTS(text, language);
  }
}

function getLanguageCode(language: string): string {
  const languageMap: Record<string, string> = {
    'en': 'en-US',
    'hi': 'hi-IN',
    'ta': 'ta-IN',
    'bn': 'bn-IN',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'it': 'it-IT',
    'pt': 'pt-PT',
    'ja': 'ja-JP',
    'ko': 'ko-KR',
    'zh': 'zh-CN'
  };
  
  return languageMap[language] || 'en-US';
}

function getVoiceName(language: string): string {
  const voiceMap: Record<string, string> = {
    'en': 'en-US-Neural2-A',
    'hi': 'hi-IN-Neural2-A',
    'ta': 'ta-IN-Neural2-A',
    'bn': 'bn-IN-Neural2-A',
    'es': 'es-ES-Neural2-A',
    'fr': 'fr-FR-Neural2-A',
    'de': 'de-DE-Neural2-A',
    'it': 'it-IT-Neural2-A',
    'pt': 'pt-PT-Neural2-A',
    'ja': 'ja-JP-Neural2-A',
    'ko': 'ko-KR-Neural2-A',
    'zh': 'zh-CN-Neural2-A'
  };
  
  return voiceMap[language] || 'en-US-Neural2-A';
}

function generateMockTTS(text: string, language: string): string {
  // Return a mock audio URL for demo purposes
  const mockAudioUrl = `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+HyvGcVGRw`;
  
  return mockAudioUrl;
}
