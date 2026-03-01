'use client';

import { LogoIcon } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import { Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * ForgotPassword Component
 * Allows users to request a password reset link via email.
 * Uses Better Auth's `requestPasswordReset` method.
 */
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  /**
   * Handles the password reset form submission.
   * On success, transition the UI to a "Check your email" state.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: '/reset-password', // The page the user is sent to after clicking the link
      });

      if (error) {
        toast.error(error.message || 'Failed to send reset link');
        return;
      }

      setIsEmailSent(true);
      toast.success('Reset link sent to your email');
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Success View: Rendered after the email has been successfully dispatched.
   */
  if (isEmailSent) {
    return (
      <section className="flex min-h-screen px-4 py-16 md:py-32 bg-transparent">
        <div className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-8 shadow-md">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <Mail className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-xl font-semibold mb-2">Check your email</h1>
            <p className="text-sm text-muted-foreground mb-6">
              We&apos;ve sent a password reset link to{' '}
              <span className="font-medium text-foreground">{email}</span>.
            </p>
            {/* Quick action buttons for the user post-submission */}
            <div className="space-y-3">
              <Button asChild className="w-full">
                <a
                  href="https://mail.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Go to Gmail
                </a>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/sign-in">Back to Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /**
   * Default View: The request form.
   */
  return (
    <section className="flex min-h-screen px-4 py-16 md:py-32 bg-transparent">
      <form
        onSubmit={handleSubmit}
        className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md"
      >
        <div className="p-8 pb-6">
          <div>
            <Link href="/" aria-label="go home">
              <LogoIcon />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">
              Forgot Password?
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and we&apos;ll send you a link to reset your
              password.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {/* Email Input Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Email
              </Label>
              <Input
                type="email"
                required
                name="email"
                id="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Submission Button with loading state */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </div>
        </div>

        {/* Navigation back to sign-in */}
        <div className="bg-muted rounded-(--radius) border p-3">
          <p className="text-accent-foreground text-center text-sm">
            Remember your password?
            <Button asChild variant="link" className="px-2">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
