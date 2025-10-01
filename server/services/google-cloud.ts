import { TranslationServiceClient } from '@google-cloud/translate';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { Storage } from '@google-cloud/storage';
import { Firestore } from '@google-cloud/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import path from 'path';

// Set the path to the service account key file
const serviceAccountPath = path.join(process.cwd(), 'your-service-account-key.json');

// Set the environment variable for Google Cloud authentication
process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceAccountPath;

// Initialize Google Cloud services
let translateClient: TranslationServiceClient | null = null;
let ttsClient: TextToSpeechClient | null = null;
let storageClient: Storage | null = null;
let firestoreClient: Firestore | null = null;
let genAI: GoogleGenerativeAI | null = null;
let documentAIClient: DocumentProcessorServiceClient | null = null;

// Initialize services
try {
  // Initialize Translation client
  translateClient = new TranslationServiceClient({
    projectId: 'your-gcp-project-id',
    keyFilename: serviceAccountPath
  });

  // Initialize Text-to-Speech client
  ttsClient = new TextToSpeechClient({
    projectId: 'your-gcp-project-id',
    keyFilename: serviceAccountPath
  });

  // Initialize Cloud Storage client
  storageClient = new Storage({
    projectId: 'your-gcp-project-id',
    keyFilename: serviceAccountPath
  });

  // Initialize Firestore client
  firestoreClient = new Firestore({
    projectId: 'your-gcp-project-id',
    databaseId: 'your-database-id',
    keyFilename: serviceAccountPath
  });

  // Initialize Gemini AI (using API key from environment)
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  
  if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
  }

  // Initialize Document AI client
  documentAIClient = new DocumentProcessorServiceClient({
    projectId: 'your-gcp-project-id',
    keyFilename: serviceAccountPath
  });

  console.log('✅ Google Cloud services initialized successfully');
  console.log('✅ Document AI client initialized for fast document parsing');
} catch (error) {
  console.error('❌ Failed to initialize Google Cloud services:', error);
  console.log('📝 Make sure the service account file exists and has proper permissions');
}

export { translateClient, ttsClient, storageClient, firestoreClient, genAI, documentAIClient };
