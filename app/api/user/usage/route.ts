import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { dailyMessageCount: true, lastMessageReset: true },
  });

  if (!user) {
    return new NextResponse('User not found', { status: 404 });
  }

  const now = new Date();
  const lastReset = user.lastMessageReset ? new Date(user.lastMessageReset) : null;
  const isNewDay = !lastReset || 
      now.getFullYear() !== lastReset.getFullYear() || 
      now.getMonth() !== lastReset.getMonth() || 
      now.getDate() !== lastReset.getDate();

  return NextResponse.json({ 
    count: isNewDay ? 0 : user.dailyMessageCount 
  });
}
