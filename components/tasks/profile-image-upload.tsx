'use client';

import { useState, useRef } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { UserAvatar } from './user-avatar';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type ProfileImageUploadProps = {
  src?: string | null;
  name?: string | null;
  className?: string;
};

/**
 * ProfileImageUpload Component
 * Features a hoverable avatar with a camera icon for uploading profile images.
 * Coordinates with S3/R2 presigned URL API for direct browser-to-bucket uploads.
 */
export function ProfileImageUpload({ src, name, className }: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Triggers the hidden file input dialog
   */
  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  /**
   * Handles the file selection and upload process
   */
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 1. Validate file type and size (limit to 5MB)
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      // 2. Request a presigned upload URL from our API
      const presignedRes = await fetch('/api/s3/presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      });

      if (!presignedRes.ok) throw new Error('Failed to get upload URL');
      const { url, key } = await presignedRes.json();

      // 3. Upload the file directly to S3/R2 using the presigned URL
      const uploadRes = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadRes.ok) throw new Error('Failed to upload image to bucket');

      // 4. Update the user's profile image in the database using Better Auth
      await authClient.updateUser({
        image: key,
      });

      toast.success('Profile image updated');
      
      // Force a session refresh to reflect changes globally
      window.location.reload(); 
    } catch (err) {
      console.error("Upload error:", err);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn("relative group cursor-pointer", className)}>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Profile Image View */}
      <div 
        onClick={handleTriggerUpload}
        className="relative size-24 md:size-32 rounded-full overflow-hidden border-4 border-background shadow-lg transition-all"
      >
        <UserAvatar 
          src={src} 
          name={name} 
          className="size-full rounded-none text-4xl md:text-5xl" 
        />
        
        {/* Camera Overlay on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {isUploading ? (
            <Loader2 className="size-8 text-white animate-spin" />
          ) : (
            <Camera className="size-8 text-white" />
          )}
        </div>

        {/* Loading Spinner for Upload in progress */}
        {isUploading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <Loader2 className="size-8 text-primary animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
