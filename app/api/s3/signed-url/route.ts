import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { s3Service } from '@/services/s3.services';

/**
 * GET /api/s3/signed-url
 * Generates a temporary signed URL for viewing a private object in S3/R2.
 * Query Params: ?key=path/to/object
 */
export async function GET(req: Request) {
  try {
    // 1. Authenticate user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 2. Extract key from URL
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (!key) {
      return new NextResponse('Missing key parameter', { status: 400 });
    }

    // 3. Generate the signed download URL
    const url = await s3Service.generateSignedDownloadUrl(key);

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Signed URL error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
