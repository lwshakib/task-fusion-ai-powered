'use client';

import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  src?: string | null;
  name?: string | null;
  className?: string;
};

/**
 * UserAvatar Component
 * A smart wrapper around Avatar that resolves S3 keys into signed URLs.
 * If the src is a full URL (external), it displays as is.
 * If src matches an S3 pattern (profiles/...), it fetches a signed URL from the API.
 */
export function UserAvatar({ src, name, className }: UserAvatarProps) {
  const [signedUrl, setSignedUrl] = useState<string | undefined>(undefined);

  // Determine if the src is an S3 key that needs resolving
  const isS3Key = useMemo(() => {
    return !!src && !src.startsWith('http') && !src.startsWith('blob:');
  }, [src]);

  // For non-S3 sources, compute the display URL synchronously (no setState needed)
  const directSrc = useMemo(() => {
    if (!src) return undefined;
    if (src.startsWith('http') || src.startsWith('blob:')) return src;
    return undefined;
  }, [src]);

  // Only fetch signed URL for actual S3 keys
  useEffect(() => {
    if (!isS3Key || !src) return;

    let cancelled = false;

    const fetchSignedUrl = async () => {
      try {
        const res = await fetch(`/api/s3/signed-url?key=${encodeURIComponent(src)}`);
        if (res.ok && !cancelled) {
          const data = await res.json();
          setSignedUrl(data.url);
        }
      } catch (err) {
        console.error("Failed to resolve S3 key:", err);
      }
    };

    fetchSignedUrl();

    return () => {
      cancelled = true;
    };
  }, [src, isS3Key]);

  // When src changes away from an S3 key, clear stale signed URL via useMemo-driven key
  const resolvedSrc = isS3Key ? signedUrl : directSrc;

  return (
    <Avatar className={cn("h-9 w-9", className)}>
      <AvatarImage src={resolvedSrc} alt={name || "User Avatar"} />
      <AvatarFallback className="bg-primary/10 text-primary font-bold select-none">
        {name?.charAt(0).toUpperCase() || (
          <User className="size-[50%]" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
