import { streamText } from '@/llm/streamText';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { MESSAGE_ROLE } from '@/generated/prisma/enums';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Rate limiting: 10 messages per day
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { dailyMessageCount: true, lastMessageReset: true },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const now = new Date();
    const lastReset = user.lastMessageReset ? new Date(user.lastMessageReset) : null;

    let currentCount = user.dailyMessageCount;
    let resetDate = lastReset;

    const isNewDay = !lastReset || 
      now.getFullYear() !== lastReset.getFullYear() || 
      now.getMonth() !== lastReset.getMonth() || 
      now.getDate() !== lastReset.getDate();

    if (isNewDay) {
      currentCount = 0;
      resetDate = now;
    }

    if (currentCount >= 10) {
      return NextResponse.json(
        { 
          error: 'Daily limit reached', 
          message: 'You have reached your limit of 10 messages per day. Please upgrade your plan to continue.' 
        }, 
        { status: 403 }
      );
    }

    // Increment count
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        dailyMessageCount: currentCount + 1,
        lastMessageReset: resetDate || new Date(),
      },
    });

    const { messages } = await req.json();

    // Get the last message (user's current message)
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      return NextResponse.json(
        { error: 'Last message must be from user' },
        { status: 400 },
      );
    }

    // Ensure parts exist, fallback to content if possible or empty array
    const parts =
      lastMessage.parts ||
      (lastMessage.content ? [{ text: lastMessage.content }] : []);

    await prisma.message.create({
      data: {
        role: MESSAGE_ROLE.user,
        parts: parts,
        userId: session.user.id,
      },
    });

    const result = await streamText(messages, session.user.id);

    // Create a custom response that saves the assistant message after streaming
    const response = result.toUIMessageStreamResponse({
      sendReasoning: true,
      sendSources: true,
    });

    return response;
  } catch (error) {
    console.error('[CHAT]', error);
    return NextResponse.json({ error: 'Failed to chat' }, { status: 500 });
  }
}
