import { GoogleGenAI } from '@google/genai';
import { GOOGLE_API_KEY } from '@/lib/env';

/**
 * Initializes and exports the Google Gen AI client.
 * Uses the API key defined in the environment variables.
 */
// Note: During build time, the API key might be missing.
// We handle this gracefully to allow the static build process to complete.
const apiKey = GOOGLE_API_KEY || 'dummy-key-for-build';

export const ai = new GoogleGenAI({
  apiKey,
});
