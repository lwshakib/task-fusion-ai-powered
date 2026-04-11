'use client';

import { useEffect, useState } from "react";
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
  const [resolvedSrc, setResolvedSrc] = useState<string | undefined>(src || undefined);

  useEffect(() => {
    // 1. Reset state if src is empty
    if (!src) {
      setResolvedSrc(undefined);
      return;
    }

    // 2. If it's a full URL (http/https), use it directly
    if (src.startsWith('http') || src.startsWith('blob:')) {
      setResolvedSrc(src);
      return;
    }

    // 3. Otherwise, treat as an S3 key and fetch a signed URL
    const fetchSignedUrl = async () => {
      try {
        const res = await fetch(`/api/s3/signed-url?key=${encodeURIComponent(src)}`);
        if (res.ok) {
          const data = await res.json();
          setResolvedSrc(data.url);
        }
      } catch (err) {
        console.error("Failed to resolve S3 key:", err);
      }
    };

    fetchSignedUrl();
  }, [src]);

  return (
    <Avatar className={cn("h-9 w-9", className)}>
      <AvatarImage src={resolvedSrc} alt={name || "User Avatar"} />
      <AvatarFallback className="bg-primary/10 text-primary">
        {name?.charAt(0).toUpperCase() || (
          <User className="size-4" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
