import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

/**
 * GET /api/message
 * Fetches all chat messages for the currently authenticated user.
 */
export async function GET() {
  try {
    // Authenticate user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Retrieve all messages associated with the user, ordered by creation time
    const messages = await prisma.message.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('[MESSAGES_GET_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/message
 * Manually creates a new message (used for persisting local chat history).
 */
export async function POST(req: Request) {
  try {
    // Authenticate user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { parts, role } = await req.json();

    // Basic validation for required message fields
    if (!parts || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: parts and role are mandatory' },
        { status: 400 },
      );
    }

    // Persist the message in the database
    const message = await prisma.message.create({
      data: {
        parts,
        role,
        userId: session.user.id,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('[MESSAGE_POST_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/message
 * Deletes the entire chat history for the authenticated user.
 */
export async function DELETE() {
  try {
    // Authenticate user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Permanently remove all messages belonging to the user
    await prisma.message.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[MESSAGES_DELETE_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
