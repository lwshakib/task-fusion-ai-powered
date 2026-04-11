import { S3Client, CreateBucketCommand, PutBucketCorsCommand, HeadBucketCommand } from "@aws-sdk/client-s3";

/**
 * Bucket Setup Script
 * Use this script to provision your Cloudflare R2 / S3 bucket 
 * and configure CORS for the Task Fusion application.
 */

async function setup() {
  const client = new S3Client({
    region: process.env.AWS_REGION || "auto",
    endpoint: process.env.AWS_ENDPOINT,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
    forcePathStyle: true,
  });

  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  console.log(`\n🚀 Initializing S3/R2 Bucket Setup: "${bucketName}"...`);

  try {
    // 1. Check if bucket exists
    try {
      await client.send(new HeadBucketCommand({ Bucket: bucketName }));
      console.log(`✅ Bucket "${bucketName}" already exists.`);
    } catch (err: unknown) {
      const s3Err = err as { name?: string; $metadata?: { httpStatusCode?: number } };
      if (s3Err.name === 'NotFound' || s3Err.$metadata?.httpStatusCode === 404) {
        console.log(`📦 Bucket "${bucketName}" not found. Creating...`);
        await client.send(new CreateBucketCommand({ Bucket: bucketName }));
        console.log(`✅ Bucket "${bucketName}" created successfully.`);
      } else {
        throw err;
      }
    }

    // 2. Apply CORS Configuration
    // Essential for direct browser-to-bucket uploads via presigned URLs.
    console.log(`🛡️  Applying CORS configuration...`);
    await client.send(new PutBucketCorsCommand({
      Bucket: bucketName,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ["*"],
            AllowedMethods: ["GET", "PUT", "POST", "HEAD"],
            AllowedOrigins: [
              "http://localhost:3000",
              process.env.NEXT_PUBLIC_BASE_URL || "",
            ].filter(Boolean),
            MaxAgeSeconds: 3600,
          },
        ],
      },
    }));
    console.log(`✅ CORS configuration applied successfully.`);
    console.log(`\n🎉 Bucket setup complete!\n`);

  } catch (error) {
    console.error(`\n❌ Setup failed:`, error);
    process.exit(1);
  }
}

setup();
