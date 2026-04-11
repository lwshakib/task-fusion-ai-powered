import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { s3Service } from '@/services/s3.services';

/**
 * POST /api/s3/presigned-url
 * Generates a presigned URL for a user to upload a profile image.
 * Expected Body: { fileName: string, fileType: string }
 */
export async function POST(req: Request) {
  try {
    // 1. Authenticate user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 2. Parse request body
    const { fileName, fileType } = await req.json();

    if (!fileName || !fileType) {
      return new NextResponse('Missing fileName or fileType', { status: 400 });
    }

    // 3. Generate the presigned URL via S3 service
    const { url, key } = await s3Service.generatePresignedUploadUrl(
      session.user.id,
      fileName,
      fileType,
    );

    return NextResponse.json({ url, key });
  } catch (error) {
    console.error('Presigned URL error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
