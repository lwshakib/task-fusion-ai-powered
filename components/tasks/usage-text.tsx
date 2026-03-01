'use client';

import { useEffect, useState, useCallback } from 'react';

export function UsageText() {
  const [remaining, setRemaining] = useState<number | null>(null);

  const fetchUsage = useCallback(async () => {
    try {
      const res = await fetch('/api/user/usage');
      if (res.ok) {
        const data = await res.json();
        setRemaining(Math.max(0, 10 - (data.count || 0)));
      }
    } catch (err) {
      console.error('Failed to fetch usage:', err);
    }
  }, []);

  useEffect(() => {
    fetchUsage();
    
    const handleMessageSent = () => {
      // Add a small delay to ensure the server has finished processing 
      // the increment before we fetch the new count
      setTimeout(fetchUsage, 500);
    };

    window.addEventListener('message-sent', handleMessageSent);
    return () => window.removeEventListener('message-sent', handleMessageSent);
  }, [fetchUsage]);

  if (remaining === null) return null;

  return (
    <span className="text-xs text-muted-foreground tabular-nums select-none animate-in fade-in duration-500">
      {remaining} {remaining === 1 ? 'message' : 'messages'} remaining
    </span>
  );
}
