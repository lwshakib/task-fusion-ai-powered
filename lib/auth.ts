import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import prisma from './prisma';
import { Resend } from 'resend';
import { AuthEmailTemplate } from '@/components/emails/auth-email-template';

/**
 * Initialize Resend client for sending transactional emails (verification, password resets).
 */
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Better Auth Configuration.
 * This object configures the authentication system including database adapters,
 * authentication methods (email, social), and lifecycle hooks for email communication.
 */
export const auth = betterAuth({
  /**
   * Database Adapter: Connects Better Auth to our Prisma PostgreSQL instance.
   */
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  /**
   * Email and Password Strategy.
   * Handles user registration, login, and password management.
   */
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    /**
     * Hook called when a password reset is requested.
     * Uses Resend to send a styled email to the user.
     */
    sendResetPassword: async ({ user, url }) => {
      try {
        const { error } = await resend.emails.send({
          from: 'Task Fusion AI <noreply@lwshakib.site>',
          to: user.email,
          subject: 'Reset your password',
          react: AuthEmailTemplate({ type: 'forgot-password', url }),
        });

        if (error) {
          console.error('Failed to send email via Resend:', error);
          throw new Error('Failed to send authentication email.');
        }
      } catch (err) {
        console.error('Resend error:', err);
        throw err;
      }
    },
  },

  /**
   * Social Authentication Providers.
   * Currently configured for Google OAuth.
   */
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  /**
   * Email Verification Configuration.
   * Ensures users verify their email addresses upon sign up.
   */
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      try {
        await resend.emails.send({
          from: 'Task Fusion AI <noreply@lwshakib.site>',
          to: user.email,
          subject: 'Verify your email address',
          react: AuthEmailTemplate({ type: 'email-verification', url }),
        });
      } catch (err) {
        console.error('Verification email error:', err);
      }
    },
  },

  /**
   * Account Level Settings.
   */
  account: {
    /**
     * Account Linking: Allows users to link multiple providers (e.g., Google and Email)
     * to the same account if they share the same email address.
     */
    accountLinking: {
      enabled: true,
    },
  },
});
