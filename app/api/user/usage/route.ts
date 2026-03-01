import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

/**
 * GET /api/user/usage
 * Retrieves the current user's AI message usage for the current day.
 */
export async function GET() {
  // 1. Authenticate the user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // 2. Fetch daily message count and last reset timestamp
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { dailyMessageCount: true, lastMessageReset: true },
  });

  if (!user) {
    return new NextResponse('User not found', { status: 404 });
  }

  // 3. Determine if the message counter should be reset for a new day
  const now = new Date();
  const lastReset = user.lastMessageReset
    ? new Date(user.lastMessageReset)
    : null;
  const isNewDay =
    !lastReset ||
    now.getFullYear() !== lastReset.getFullYear() ||
    now.getMonth() !== lastReset.getMonth() ||
    now.getDate() !== lastReset.getDate();

  // Return the count, defaulting to 0 if it's a new day
  return NextResponse.json({
    count: isNewDay ? 0 : user.dailyMessageCount,
  });
}
