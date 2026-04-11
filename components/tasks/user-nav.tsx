'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserAvatar } from '@/components/tasks/user-avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import {
  LogOut,
  User,
  Settings,
  LayoutDashboard,
  CreditCard,
} from 'lucide-react';
import Link from 'next/link';

/**
 * UserNav Component
 * Provides a user menu with profile info, app links (Account, Billing), and sign-out functionality.
 * Integrates with Better Auth SDK for session and sign-out management.
 */
export function UserNav() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  // Guard: If no active session, hide the nav menu
  if (!session) return null;

  const user = session.user;

  /**
   * Handles the sign-out process using the Better Auth client.
   * Redirects to the sign-in page upon successful logout.
   */
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in');
        },
      },
    });
  };

  return (
    <div className="flex items-center gap-2">
      <AlertDialog>
        <DropdownMenu>
          {/* User Profile Trigger Button */}
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <UserAvatar 
                className="h-9 w-9" 
                src={user?.image} 
                name={user?.name} 
              />
            </Button>
          </DropdownMenuTrigger>

          {/* User Menu Content */}
          <DropdownMenuContent className="w-56" align="end" forceMount>
            {/* Header: User Info Summary */}
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Main App Navigation Links */}
            <DropdownMenuItem asChild>
              <Link href="/tasks" className="flex items-center">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Tasks</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/billing" className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Logout Action (Protected by AlertDialog) */}
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Global Sign-out Confirmation Modal */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to log out?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You will be redirected to the sign-in page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
