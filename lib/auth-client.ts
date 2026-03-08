import { createAuthClient } from 'better-auth/react';

/**
 * Better Auth Client for React.
 * This client is used in the frontend to interact with the authentication system
 * (login, logout, session management, etc.).
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
});
