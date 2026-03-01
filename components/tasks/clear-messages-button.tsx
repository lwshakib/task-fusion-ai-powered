'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
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

/**
 * ClearMessagesButton Component
 * Provides a UI to permanently delete the user's chat history.
 * Includes a confirmation dialog to prevent accidental deletion.
 */
export function ClearMessagesButton() {
  const [isClearing, setIsClearing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Sends a DELETE request to clear the server-side message history
   * and dispatches a local event to update the UI.
   */
  const handleClear = async () => {
    setIsClearing(true);
    try {
      const response = await fetch('/api/message', {
        method: 'DELETE',
      });

      if (response.ok) {
        // Notify ChatInterface and other listeners to clear their local states
        window.dispatchEvent(new CustomEvent('clear-chat'));
        toast.success('Chat history cleared');
      } else {
        throw new Error('Failed to clear chat history');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to clear chat history');
    } finally {
      setIsClearing(false);
      setIsOpen(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger button for the alert dialog */}
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={isClearing}
          className="text-muted-foreground hover:text-destructive transition-colors h-8 px-2"
        >
          <Trash2 className="size-4 mr-2" />
          <span className="hidden sm:inline">Clear Chat</span>
        </Button>
      </AlertDialogTrigger>

      {/* Confirmation Dialog Content */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            entire chat history from this session.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isClearing}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              // Prevent default to handle the async clearing process manually
              e.preventDefault();
              handleClear();
            }}
            disabled={isClearing}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isClearing ? 'Clearing...' : 'Yes, clear chat'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
