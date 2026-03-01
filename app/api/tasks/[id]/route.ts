import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Task Update Validation Schema
 */
const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'COMPLETED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
});

/**
 * PATCH /api/tasks/[id]
 * Updates an existing task after verifying ownership.
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Authenticate user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await params;

    // 2. Parse and validate updated task data
    const body = await req.json();
    const { title, description, status, priority } = taskSchema.parse(body);

    // 3. Verify task exists and belongs to the authenticated user
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return new NextResponse('Task Not Found', { status: 404 });
    }

    if (existingTask.userId !== session.user.id) {
      return new NextResponse('Forbidden: You do not own this task', {
        status: 403,
      });
    }

    // 4. Update the task in the database
    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        priority,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('[TASK_PATCH_ERROR]', error);
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid Request Data', { status: 400 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * DELETE /api/tasks/[id]
 * Permanently removes a task after verifying ownership.
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Authenticate user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await params;

    // 2. Verify task exists and belongs to the authenticated user
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return new NextResponse('Task Not Found', { status: 404 });
    }

    if (existingTask.userId !== session.user.id) {
      return new NextResponse('Forbidden: You do not own this task', {
        status: 403,
      });
    }

    // 3. Delete the task from database
    await prisma.task.delete({
      where: { id },
    });

    // Return 204 No Content on success
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[TASK_DELETE_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
