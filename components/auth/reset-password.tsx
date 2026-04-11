'use client';

import { LogoIcon } from '@/components/layout/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { toast } from 'sonner';

/**
 * ResetPasswordForm Component
 * The core logic for handling password resets.
 * Reads a verification token from the URL and submits the new password to Better Auth.
 */
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Extract the reset token from the URL query string
  const token = searchParams.get('token');

  /**
   * Effect: Validates the presence of the reset token on mount.
   * If missing, redirects the user back to the forgot-password flow.
   */
  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      router.push('/forgot-password');
    }
  }, [token, router]);

  /**
   * Handles the password reset submission.
   * Performs client-side validation for password matching and strength.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token: token || '',
      });

      if (error) {
        toast.error(error.message || 'Failed to reset password');
        return;
      }

      toast.success('Password reset successfully!');
      router.push('/sign-in');
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };


  /**
   * Default View: The password reset form.
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
            <h1 className="mb-1 mt-4 text-xl font-semibold">Reset Password</h1>
            <p className="text-sm text-muted-foreground">
              Enter your new password below to reset your account access.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="password"
                title="Password"
                className="block text-sm"
              >
                New Password
              </Label>
              <Input
                type="password"
                required
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                title="Confirm Password"
                className="block text-sm"
              >
                Confirm New Password
              </Label>
              <Input
                type="password"
                required
                name="confirmPassword"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !token}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting password...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}

/**
 * ResetPassword Component (Entry Point)
 * Wraps the form in a `Suspense` boundary because `useSearchParams`
 * triggers a client-side de-optimization in Next.js.
 */
export default function ResetPassword() {
  return (
    <Suspense
      fallback={
        <section className="flex min-h-screen px-4 py-16 md:py-32 bg-transparent">
          <div className="m-auto flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </section>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
