import { aiService } from '@/services/ai.services';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { MESSAGE_ROLE } from '@/generated/prisma/enums';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

/**
 * POST /api/chat
 * Handles incoming AI chat requests, implements rate limiting,
 * persists user messages, and streams the AI response.
 */
export async function POST(req: Request) {
  try {
    // 1. Authenticate the request using better-auth session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 2. Implement Rate Limiting: Max 10 messages per day for free tier
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { dailyMessageCount: true, lastMessageReset: true },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const now = new Date();
    const lastReset = user.lastMessageReset
      ? new Date(user.lastMessageReset)
      : null;

    let currentCount = user.dailyMessageCount;
    let resetDate = lastReset;

    // Check if a new day has started to reset the daily count
    const isNewDay =
      !lastReset ||
      now.getFullYear() !== lastReset.getFullYear() ||
      now.getMonth() !== lastReset.getMonth() ||
      now.getDate() !== lastReset.getDate();

    if (isNewDay) {
      currentCount = 0;
      resetDate = now;
    }

    // Block the request if the daily limit is reached
    if (currentCount >= 20) {
      return NextResponse.json(
        {
          error: 'Daily limit reached',
          message:
            'You have reached your limit of 20 messages per day. Please upgrade your plan to continue.',
        },
        { status: 403 },
      );
    }

    // 3. Increment the daily message count for the user
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        dailyMessageCount: currentCount + 1,
        lastMessageReset: resetDate || new Date(),
      },
    });

    // 4. Parse messages from request body
    const { messages } = await req.json();

    // Validate that the request contains a valid user message
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      return NextResponse.json(
        { error: 'Last message must be from user' },
        { status: 400 },
      );
    }

    // Format parts for database storage (supports text and multi-modal in future)
    const parts =
      lastMessage.parts ||
      (lastMessage.content
        ? [{ type: 'text', text: lastMessage.content }]
        : []);

    // 5. Persist the user's message to the database
    await prisma.message.create({
      data: {
        role: MESSAGE_ROLE.user,
        parts: parts,
        userId: session.user.id,
      },
    });

    // 6. Initiate the AI streaming process
    const result = await aiService.streamText(messages, session.user.id);

    // 7. Return the UI-compatible stream response
    const response = result.toUIMessageStreamResponse({
      sendReasoning: true, // Include the AI's "thought" process if available
      sendSources: true, // Include any referenced context sources
    });

    return response;
  } catch (error) {
    console.error('[CHAT_ERROR]', error);
    return NextResponse.json(
      { error: 'An internal server error occurred during chat' },
      { status: 500 },
    );
  }
}
