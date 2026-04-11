'use client';

import { useState, useEffect } from 'react';
import { ModeToggle } from '@/components/layout/mode-toggle';
import { UserNav } from '@/components/tasks/user-nav';
import { ProfileImageUpload } from '@/components/tasks/profile-image-upload';
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
  Mail,
  ShieldCheck,
  Globe,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * AccountPage Component
 * Provides a modern, responsive interface for managing user profile,
 * connected authentication accounts, and active device sessions.
 */
export default function AccountPage() {
  const { data: session, isPending: isSessionPending, refetch } = authClient.useSession();
  const router = useRouter();

  // Profile Update State
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [userName, setUserName] = useState('');

  // Dynamic Data State
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

  // Initialize name from session
  useEffect(() => {
    if (session?.user?.name) {
      setUserName(session.user.name);
    }
  }, [session]);

  // Fetch real data from Better Auth
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Active Sessions
        const sessRes = await authClient.listSessions();
        if (sessRes.data) {
          setSessions(sessRes.data);
        }

        // 2. Fetch Connected Accounts
        const accRes = await authClient.listAccounts();
        if (accRes.data) {
          setAccounts(accRes.data);
        }
      } catch (err) {
        console.error('Failed to fetch account data:', err);
      } finally {
        setIsLoadingSessions(false);
        setIsLoadingAccounts(false);
      }
    };

    if (session) {
      fetchData();
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
    } finally {
      setIsUpdatingName(false);
    }
  };

  /**
   * Revokes an active session
   */
  const handleRevokeSession = async (token: string) => {
    try {
      await authClient.revokeSession({ token });
      setSessions((prev) => prev.filter((s) => s.token !== token));
      toast.success('Session terminated');
    } catch (err) {
      toast.error('Failed to revoke session');
    }
  };

  // Helper to map provider IDs to icons/labels
  const getProviderInfo = (providerId: string) => {
    switch (providerId.toLowerCase()) {
      case 'google':
        return { label: 'Google', color: 'text-foreground' };
      case 'microsoft':
        return { label: 'Microsoft', color: 'text-foreground' };
      case 'github':
        return { label: 'GitHub', color: 'text-foreground' };
      case 'credential':
      case 'email':
        return { label: 'Email & Password', color: 'text-foreground' };
      default:
        return { label: providerId, color: 'text-muted-foreground' };
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
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/10">
      {/* Header (Preserved as requested) */}
      <header className="sticky top-0 flex h-16 shrink-0 items-center justify-between px-6 bg-background/95 backdrop-blur-md border-b z-30">
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

      <main className="flex-1 p-4 md:p-8 lg:p-12">
        <div className="mx-auto max-w-6xl w-full">
          {/* Page Heading */}
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-foreground">
              Settings
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your personal information, connected accounts, and security.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* LEFT COLUMN: Profile Spotlight */}
            <div className="lg:sticky lg:top-24 space-y-6 lg:col-span-1">
              <Card className="overflow-hidden border shadow-lg bg-card ring-1 ring-border/50">
                <CardContent className="pt-10 pb-8 flex flex-col items-center text-center">
                  <ProfileImageUpload
                    src={session.user.image}
                    name={session.user.name}
                    className="mb-6"
                    onSuccess={() => refetch()}
                  />
                  <div className="space-y-2 w-full px-4 overflow-hidden">
                    <h2 className="text-2xl font-bold truncate" title={session.user.name || ''}>
                      {session.user.name}
                    </h2>
                    <p className="text-sm text-muted-foreground truncate" title={session.user.email || ''}>
                      {session.user.email}
                    </p>
                    <div className="pt-4 flex justify-center">
                      <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground ring-1 ring-inset ring-border">
                        <ShieldCheck className="mr-1 size-3" />
                        Active Account
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/30 border-dashed">
                <CardContent className="p-4 text-xs text-muted-foreground leading-relaxed">
                  Your profile information is shared across Task Fusion services to help us 
                  provide a consistent and personalized experience.
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN: Configuration and Security */}
            <div className="lg:col-span-2 space-y-8 min-w-0">
              {/* Basic Information Card */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Display Name</CardTitle>
                  <CardDescription>
                    This is how you will appear to others in collaborate mode.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Your name"
                      className="max-w-md"
                    />
                  </div>
                  <div className="space-y-2 opacity-70">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2 text-sm font-medium bg-muted p-2 rounded-md border max-w-md">
                      <Mail className="size-4 text-muted-foreground" />
                      {session.user.email}
                    </div>
                    <p className="text-[11px] text-muted-foreground italic">
                      Contact support to change your primary account email.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/20 border-t py-4">
                  <Button
                    onClick={handleUpdateName}
                    disabled={isUpdatingName || userName === session.user.name}
                  >
                    {isUpdatingName ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="mr-2 size-4" />
                    )}
                    Update Name
                  </Button>
                </CardFooter>
              </Card>

              {/* Connected Accounts Card */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Connected Accounts</CardTitle>
                  <CardDescription>
                    Third-party accounts used to sign in to Task Fusion.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingAccounts ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="size-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : accounts.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed rounded-xl text-muted-foreground">
                      No linked accounts found.
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {accounts.map((acc) => {
                        const info = getProviderInfo(acc.providerId);
                        return (
                          <div 
                            key={acc.id}
                            className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-all group"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`p-2.5 rounded-lg bg-secondary ring-1 ring-border group-hover:scale-105 transition-transform ${info.color}`}>
                                <Globe className="size-5" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold">{info.label}</p>
                                <p className="text-xs text-muted-foreground">Linked Provider</p>
                              </div>
                            </div>
                            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded">
                              <div className="size-1.5 rounded-full bg-muted-foreground" />
                              Active
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Security & Sessions Card */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                  <CardDescription>
                    Devices currently logged in to your account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-2 sm:px-6">
                  {isLoadingSessions ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="size-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {sessions.map((sess) => (
                        <div
                          key={sess.token}
                          className="flex items-center justify-between gap-4 p-3 rounded-xl border bg-card hover:shadow-sm transition-all min-w-0"
                        >
                          <div className="flex items-center gap-3 overflow-hidden min-w-0">
                            <div className="p-2 bg-muted rounded-lg shrink-0">
                              {sess.userAgent?.includes('Mobi') ? (
                                <Smartphone className="size-4 text-muted-foreground" />
                              ) : (
                                <Laptop className="size-4 text-muted-foreground" />
                              )}
                            </div>
                            <div className="truncate min-w-0">
                              <p className="text-sm font-semibold truncate flex items-center gap-2">
                                {sess.userAgent || 'Unknown Browser'}
                                {sess.token === session.session.token && (
                                  <span className="shrink-0 text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter border">
                                    Current
                                  </span>
                                )}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                Last used: {new Date(sess.updatedAt).toLocaleDateString()} at {new Date(sess.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                          
                          {sess.token !== session.session.token && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10 shrink-0 size-8"
                              onClick={() => handleRevokeSession(sess.token)}
                              title="Revoke session"
                            >
                              <Trash2 className="size-4" />
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
        </div>
      </main>
    </div>
  );
}
