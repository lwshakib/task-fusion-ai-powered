import { GoogleGenAI } from '@google/genai';
import { GOOGLE_API_KEY } from '@/lib/env';

/**
 * Initializes and exports the Google Gen AI client.
 * Uses the API key defined in the environment variables.
 */
if (!GOOGLE_API_KEY) {
  throw new Error('Missing GOOGLE_API_KEY environment variable.');
}

export const ai = new GoogleGenAI({
  apiKey: GOOGLE_API_KEY,
});
