'use client';

import { useState, useEffect } from 'react';
import { ModeToggle } from '@/components/layout/mode-toggle';
import { UserNav } from '@/components/tasks/user-nav';
import { UsageText } from '@/components/tasks/usage-text';
import { authClient } from '@/lib/auth-client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Laptop,
  Smartphone,
  Loader2,
  CheckCircle2,
  ChevronLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * AccountPage Component
 * Handles user profile management, active session tracking, and account deletion.
 */
export default function AccountPage() {
  // Authentication session data
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  // State for profile name update
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [userName, setUserName] = useState('');

  // State for active user sessions
  const [sessions, setSessions] = useState<
    { token: string; userAgent?: string; updatedAt: string }[]
  >([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  const router = useRouter();

  // Initialize userName state when session data is available
  useEffect(() => {
    if (session?.user?.name) {
      setUserName(session.user.name);
    }
  }, [session]);

  // Fetch active sessions for the current user
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // Safe check for listSessions method on authClient
        if (
          typeof (authClient as unknown as Record<string, unknown>)
            .listSessions === 'function'
        ) {
          const res = await (
            authClient as unknown as { listSessions: () => Promise<unknown> }
          ).listSessions();
          // better-auth returns { data: [...] } — extract the array safely
          const resObj = res as Record<string, unknown> | undefined;
          const list = Array.isArray(res)
            ? res
            : Array.isArray(resObj?.data)
              ? resObj.data
              : [];
          setSessions(
            list as { token: string; userAgent?: string; updatedAt: string }[],
          );
        } else {
          // Fallback: show current session only if listSessions is not available
          setSessions([
            {
              token: session?.session.token ?? '',
              userAgent:
                typeof window !== 'undefined'
                  ? navigator.userAgent
                  : 'Current Session',
              updatedAt: new Date().toISOString(),
            },
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch sessions:', err);
      } finally {
        setIsLoadingSessions(false);
      }
    };

    if (session) {
      fetchSessions();
    }
  }, [session]);

  /**
   * Updates the user's display name
   */
  const handleUpdateName = async () => {
    if (!userName.trim()) return;
    setIsUpdatingName(true);
    try {
      await authClient.updateUser({
        name: userName,
      });
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
      console.error(err);
    } finally {
      setIsUpdatingName(false);
    }
  };

  /**
   * Revokes a specific active session
   * @param token - The unique token of the session to revoke
   */
  const handleRevokeSession = async (token: string) => {
    try {
      await (
        authClient as unknown as {
          revokeSession: (opts: { token: string }) => Promise<void>;
        }
      ).revokeSession({ token });
      // Remove the revoked session from local state
      setSessions((prev) => prev.filter((s) => s.token !== token));
      toast.success('Session revoked');
    } catch (err) {
      toast.error('Failed to revoke session');
      console.error(err);
    }
  };

  // Show loading state while session is being verified
  if (isSessionPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to sign-in if no active session is found
  if (!session) {
    router.replace('/sign-in');
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header with navigation back to tasks and account utilities */}
      <header className="sticky top-0 flex h-16 shrink-0 items-center justify-between px-6 bg-background/95 backdrop-blur-md border-b z-20">
        <Link
          href="/tasks"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="size-4" />
          <span>Back to tasks</span>
        </Link>
        <div className="flex items-center gap-4">
          <UsageText />
          <ModeToggle />
          <UserNav />
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Account Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account settings and active sessions.
            </p>
          </div>

          <div className="grid gap-8">
            {/* Profile Management Section */}
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Update your personal information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Email field (read-only for security) */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={session.user.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email address cannot be changed.
                  </p>
                </div>
                {/* Editable Name field */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button
                  onClick={handleUpdateName}
                  disabled={isUpdatingName || userName === session.user.name}
                >
                  {isUpdatingName && (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </CardFooter>
            </Card>

            {/* External Authentication Providers section */}
            <Card>
              <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
                <CardDescription>
                  Manage external authentication providers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Google Connection (Currently active) */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="size-8 bg-zinc-100 dark:bg-zinc-800 rounded flex items-center justify-center font-bold">
                      G
                    </div>
                    <div>
                      <p className="text-sm font-medium">Google</p>
                      <p className="text-xs text-muted-foreground">Connected</p>
                    </div>
                  </div>
                  <CheckCircle2 className="size-5 text-green-500" />
                </div>

                {/* Microsoft Connection (Placeholder for future use) */}
                <div className="flex items-center justify-between p-4 border rounded-lg opacity-50">
                  <div className="flex items-center gap-3">
                    <div className="size-8 bg-zinc-100 dark:bg-zinc-800 rounded flex items-center justify-center font-bold">
                      M
                    </div>
                    <div>
                      <p className="text-sm font-medium">Microsoft</p>
                      <p className="text-xs text-muted-foreground">
                        Not available right now
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Login Sessions Monitoring Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Active Sessions</CardTitle>
                <CardDescription>
                  Devices where you are currently logged in.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingSessions ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                  </div>
                ) : sessions.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2 text-center border rounded-lg border-dashed">
                    No active sessions found.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {sessions.map((sess) => (
                      <div
                        key={sess.token}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          {sess.userAgent?.includes('Mobi') ? (
                            <Smartphone className="size-3.5 text-muted-foreground shrink-0" />
                          ) : (
                            <Laptop className="size-3.5 text-muted-foreground shrink-0" />
                          )}
                          <div className="truncate">
                            <p className="text-sm font-medium truncate flex items-center gap-2">
                              {sess.userAgent || 'Unknown Device'}
                              {sess.token === session.session.token && (
                                <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded-full font-semibold">
                                  Current
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {new Date(sess.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {sess.token !== session.session.token && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive h-7 px-2 text-xs hover:bg-destructive/10"
                            onClick={() => handleRevokeSession(sess.token)}
                          >
                            Revoke
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
