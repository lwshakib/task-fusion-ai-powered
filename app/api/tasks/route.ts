import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Task Validation Schema
 * Ensures all incoming task data meets the required structure and constraints.
 */
const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'COMPLETED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().optional(), // Currently handled as optional string/ISO date
});

/**
 * GET /api/tasks
 * Retrieves all tasks for the currently authenticated user.
 */
export async function GET() {
  try {
    // Authenticate the user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Fetch tasks from database, ordered by newest first
    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('[TASKS_GET_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * POST /api/tasks
 * Creates a new task for the currently authenticated user.
 */
export async function POST(req: Request) {
  try {
    // Authenticate the user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Parse and validate the request body
    const body = await req.json();
    const { title, description, status, priority } = taskSchema.parse(body);

    // Create the task in the database
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        userId: session.user.id,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('[TASKS_POST_ERROR]', error);
    // Handle validation errors specifically
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid Request Data', { status: 400 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
