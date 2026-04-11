import { S3Client, ListObjectsV2Command, DeleteObjectsCommand, DeleteBucketCommand } from "@aws-sdk/client-s3";

/**
 * Bucket Teardown Script
 * Use this script to empty and delete your Cloudflare R2 / S3 bucket.
 * ⚠️ WARNING: THIS IS DESTRUCTIVE. ALL DATA IN THE BUCKET WILL BE ERASED.
 */

async function teardown() {
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

  console.log(`\n🧨 Initializing S3/R2 Bucket Teardown: "${bucketName}"...`);

  try {
    // 1. List all objects
    console.log(`🔍 Listing objects in "${bucketName}"...`);
    const listRes = await client.send(new ListObjectsV2Command({ Bucket: bucketName }));
    const objects = listRes.Contents;

    if (objects && objects.length > 0) {
      console.log(`🗑️  Deleting ${objects.length} objects...`);
      await client.send(new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: {
          Objects: objects.map(obj => ({ Key: obj.Key })),
          Quiet: true,
        },
      }));
      console.log(`✅ All objects deleted.`);
    } else {
      console.log(`ℹ️  Bucket is already empty.`);
    }

    // 2. Delete the bucket
    console.log(`🧨 Deleting bucket "${bucketName}"...`);
    await client.send(new DeleteBucketCommand({ Bucket: bucketName }));
    console.log(`✅ Bucket deleted successfully.`);
    console.log(`\n✨ Teardown complete!\n`);

  } catch (error: any) {
    if (error.name === 'NoSuchBucket' || error.$metadata?.httpStatusCode === 404) {
      console.log(`ℹ️  Bucket "${bucketName}" does not exist. Skipping teardown.`);
    } else {
      console.error(`\n❌ Teardown failed:`, error);
      process.exit(1);
    }
  }
}

teardown();
