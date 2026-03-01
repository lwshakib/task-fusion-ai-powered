'use client';

import { useState, useEffect } from 'react';
import { ModeToggle } from '@/components/mode-toggle';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Laptop,
  Smartphone,
  Trash2,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  ChevronLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AccountPage() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [userName, setUserName] = useState('');
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.name) {
      setUserName(session.user.name);
    }
  }, [session]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        if (typeof (authClient as any).listSessions === 'function') {
          const res = await (authClient as any).listSessions();
          // better-auth returns { data: [...] } — extract the array safely
          const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
          setSessions(list);
        } else {
          // Fallback: show current session only
          setSessions([
            {
              token: session?.session.token,
              userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Current Session',
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

  const handleRevokeSession = async (token: string) => {
    try {
      await (authClient as any).revokeSession({ token });
      setSessions((prev) => prev.filter((s) => s.token !== token));
      toast.success('Session revoked');
    } catch (err) {
      toast.error('Failed to revoke session');
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await authClient.deleteUser();
      toast.success('Account deleted successfully');
      router.push('/sign-in');
    } catch (err) {
      toast.error('Failed to delete account');
      console.error(err);
    }
  };

  if (isSessionPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    router.replace('/sign-in');
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
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
            <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and active sessions.
            </p>
          </div>

          <div className="grid gap-8">
            {/* Profile Section */}
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Update your personal information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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

            {/* Connected Accounts */}
            <Card>
              <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
                <CardDescription>
                  Manage external authentication providers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Simplified list based on available providers in auth.ts (Google) */}
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

                <div className="flex items-center justify-between p-4 border rounded-lg opacity-50">
                  <div className="flex items-center gap-3">
                    <div className="size-8 bg-zinc-100 dark:bg-zinc-800 rounded flex items-center justify-center font-bold">
                      M
                    </div>
                    <div>
                      <p className="text-sm font-medium">Microsoft</p>
                      <p className="text-xs text-muted-foreground">Not available right now</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sessions Section */}
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>
                  Devices where you are currently logged in.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingSessions ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                  </div>
                ) : sessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-4 text-center">
                    No active sessions found.
                  </p>
                ) : (
                  <div className="divide-y space-y-4">
                    {sessions.map((sess) => (
                      <div
                        key={sess.token}
                        className="flex items-start justify-between pt-4 first:pt-0"
                      >
                        <div className="flex gap-3">
                          <div className="mt-1 p-2 bg-muted rounded">
                            {sess.userAgent?.includes('Mobi') ? (
                              <Smartphone className="size-4" />
                            ) : (
                              <Laptop className="size-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {sess.userAgent || 'Unknown Device'}
                              {sess.token === session.session.token && (
                                <span className="ml-2 text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded-full">
                                  Current
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Last active: {new Date(sess.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {sess.token !== session.session.token && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive h-8 px-2"
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

            {/* Danger Zone */}
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible actions for your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-destructive/10 p-4 rounded-lg flex items-start gap-3 border border-destructive/20 mb-4">
                  <AlertTriangle className="size-5 text-destructive shrink-0" />
                  <p className="text-sm text-destructive font-medium">
                    Deleting your account is permanent and cannot be undone. All
                    your tasks and data will be lost.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 size-4" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={handleDeleteAccount}
                      >
                        Delete Forever
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
