'use client';

import { LogoIcon } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    token ? 'loading' : 'error',
  );
  const [message, setMessage] = useState(
    token
      ? 'Verifying your email address...'
      : 'Invalid or missing verification token.',
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    const verifyToken = async () => {
      try {
        const { error } = await authClient.verifyEmail({
          query: {
            token,
          },
        });

        if (error) {
          setStatus('error');
          setMessage(error.message || 'Failed to verify email address.');
          return;
        }

        setStatus('success');
        setMessage('Your email has been successfully verified.');
      } catch {
        setStatus('error');
        setMessage('An unexpected error occurred during verification.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <section className="flex min-h-screen px-4 py-16 md:py-32 bg-transparent">
      <div className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-8 shadow-md text-center">
        <Link href="/" className="inline-block mb-6" aria-label="go home">
          <LogoIcon />
        </Link>

        {status === 'loading' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <h1 className="text-xl font-semibold">Verifying Email</h1>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/30 dark:text-green-500">
                <CheckCircle2 className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-xl font-semibold">Email Verified!</h1>
            <p className="text-sm text-muted-foreground">{message}</p>
            <Button asChild className="w-full mt-4">
              <Link href="/sign-in">Back to Login</Link>
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-red-100 p-3 text-red-600 dark:bg-red-900/30 dark:text-red-500">
                <XCircle className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-xl font-semibold">Verification Failed</h1>
            <p className="text-sm text-muted-foreground">{message}</p>
            <Button asChild variant="outline" className="w-full mt-4">
              <Link href="/sign-in">Back to Login</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense
      fallback={
        <section className="flex min-h-screen px-4 py-16 md:py-32 bg-transparent">
          <div className="m-auto flex items-center justify-center text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </section>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
