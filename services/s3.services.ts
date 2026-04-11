import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * S3Service Class
 * Encapsulates all S3-compatible storage operations (Cloudflare R2).
 * Provides methods for secure file upload and temporary asset viewing.
 */
class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    // 1. Initialize S3 client for Cloudflare R2
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || "auto",
      endpoint: process.env.AWS_ENDPOINT,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
      // R2 often requires path style for certain operations
      forcePathStyle: true,
    });

    this.bucketName = process.env.AWS_S3_BUCKET_NAME as string;
  }

  /**
   * Generates a presigned URL for uploading a file directly to the S3/R2 bucket.
   * 
   * @param userId - Unique identifier of the user (for path namespacing).
   * @param fileName - The original name of the file being uploaded.
   * @param fileType - The MIME type of the file (e.g., 'image/jpeg').
   * @returns An object containing the upload URL and the final object key.
   */
  async generatePresignedUploadUrl(
    userId: string,
    fileName: string,
    fileType: string
  ) {
    const timestamp = Date.now();
    const extension = fileName.split('.').pop();
    const key = `profiles/${userId}/avatar-${timestamp}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: fileType,
    });

    // URL expires in 15 minutes
    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 900 });

    return { url, key };
  }

  /**
   * Generates a signed URL for reading a private file from the S3/R2 bucket.
   * 
   * @param key - The unique object key (path) in the bucket.
   * @param expiresIn - Optional expiration time in seconds (default: 1 hour).
   * @returns A temporary signed URL for viewing the resource.
   */
  async generateSignedDownloadUrl(
    key: string,
    expiresIn = 3600
  ) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }
}

/**
 * Export a singleton instance of the S3Service
 */
export const s3Service = new S3Service();
