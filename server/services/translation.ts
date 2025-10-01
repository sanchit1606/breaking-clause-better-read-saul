import { translateClient } from "./google-cloud";

export async function translateTextWithGoogleCloud(text: string, targetLanguage: string): Promise<string> {
  try {
    if (!translateClient) {
      console.log('Translation client not available, falling back to mock translation');
      return generateMockTranslation(text, targetLanguage);
    }

    // Translate the text using the TranslationServiceClient
    const request = {
      parent: `projects/your-gcp-project-id/locations/global`,
      contents: [text],
      mimeType: 'text/plain',
      sourceLanguageCode: 'en',
      targetLanguageCode: targetLanguage,
    };

    const [response] = await translateClient.translateText(request);
    
    if (response.translations && response.translations.length > 0) {
      return response.translations[0].translatedText || text;
    }
    
    return text;
  } catch (error) {
    console.error("Google Cloud Translation error:", error);
    console.log('Falling back to mock translation');
    return generateMockTranslation(text, targetLanguage);
  }
}

function generateMockTranslation(text: string, targetLanguage: string): string {
  // Mock translations for demo purposes
  const mockTranslations: Record<string, Record<string, string>> = {
    'hi': {
      'Payment Terms': 'भुगतान की शर्तें',
      'Interest Rate': 'ब्याज दर',
      'Default & Penalties': 'चूक और दंड',
      'Contract Duration': 'अनुबंध की अवधि',
      'Security & Collateral': 'सुरक्षा और जमानत',
      'General Terms': 'सामान्य शर्तें'
    },
    'ta': {
      'Payment Terms': 'கட்டண விதிமுறைகள்',
      'Interest Rate': 'வட்டி விகிதம்',
      'Default & Penalties': 'மீறல் மற்றும் தண்டனைகள்',
      'Contract Duration': 'ஒப்பந்த காலம்',
      'Security & Collateral': 'பாதுகாப்பு மற்றும் உத்தரவாதம்',
      'General Terms': 'பொதுவான விதிமுறைகள்'
    },
    'bn': {
      'Payment Terms': 'পেমেন্টের শর্তাবলী',
      'Interest Rate': 'সুদের হার',
      'Default & Penalties': 'ডিফল্ট এবং জরিমানা',
      'Contract Duration': 'চুক্তির সময়কাল',
      'Security & Collateral': 'নিরাপত্তা এবং জামানত',
      'General Terms': 'সাধারণ শর্তাবলী'
    },
    'es': {
      'Payment Terms': 'Términos de Pago',
      'Interest Rate': 'Tasa de Interés',
      'Default & Penalties': 'Incumplimiento y Penalizaciones',
      'Contract Duration': 'Duración del Contrato',
      'Security & Collateral': 'Seguridad y Garantía',
      'General Terms': 'Términos Generales'
    },
    'fr': {
      'Payment Terms': 'Conditions de Paiement',
      'Interest Rate': 'Taux d\'Intérêt',
      'Default & Penalties': 'Défaut et Pénalités',
      'Contract Duration': 'Durée du Contrat',
      'Security & Collateral': 'Sécurité et Garantie',
      'General Terms': 'Conditions Générales'
    }
  };

  const languageTranslations = mockTranslations[targetLanguage];
  if (!languageTranslations) {
    return text; // Return original text if language not supported
  }

  // Apply mock translations
  let translatedText = text;
  Object.entries(languageTranslations).forEach(([english, translated]) => {
    translatedText = translatedText.replace(new RegExp(english, 'gi'), translated);
  });

  return translatedText;
}
