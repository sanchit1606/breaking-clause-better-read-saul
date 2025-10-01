// Firestore-based database configuration
// No need for Drizzle ORM or SQL databases - using Firestore directly
import { firestoreEnhancedStorage } from './services/firestore-enhanced-storage';

// Export the Firestore storage instance as the database
export const db = firestoreEnhancedStorage;
