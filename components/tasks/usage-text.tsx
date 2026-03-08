'use client';

import { useEffect, useState, useCallback } from 'react';

/**
 * UsageText Component
 * Displays the number of AI messages remaining for the user today.
 * Syncs with the server whenever a message is sent to provide real-time updates.
 */
export function UsageText() {
  const [remaining, setRemaining] = useState<number | null>(null);

  /**
   * Fetches the current message count from the user usage API
   * and calculates the remaining balance based on a daily limit of 20.
   */
  const fetchUsage = useCallback(async () => {
    try {
      const res = await fetch('/api/user/usage');
      if (res.ok) {
        const data = await res.json();
        setRemaining(Math.max(0, 20 - (data.count || 0)));
      }
    } catch {
      console.error('Failed to fetch usage');
    }
  }, []);

  /**
   * Effect: Initial fetch and setup of event listeners.
   * Listens for the custom 'message-sent' event to trigger a re-fetch.
   */
  useEffect(() => {
    // Initial fetch on component mount - defer to avoid synchronous setState warning
    void Promise.resolve().then(fetchUsage);

    const handleMessageSent = () => {
      // Add a small delay (500ms) to ensure the server-side DB increment
      // is fully committed before we poll for the updated count.
      setTimeout(fetchUsage, 500);
    };

    // This event is dispatched by ChatInterface when the user submits a prompt
    window.addEventListener('message-sent', handleMessageSent);
    return () => {
      window.removeEventListener('message-sent', handleMessageSent);
    };
  }, [fetchUsage]);

  // Don't render anything until the initial count is fetched
  if (remaining === null) return null;

  return (
    <span className="text-xs text-muted-foreground tabular-nums select-none animate-in fade-in duration-500">
      {remaining} {remaining === 1 ? 'message' : 'messages'} remaining
    </span>
  );
}
