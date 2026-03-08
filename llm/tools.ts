import { z } from 'zod';
import prisma from '@/lib/prisma';

/**
 * Zod schema for a Task object.
 * Defines the structure and validation rules for tasks created or updated via AI tools.
 */
export const taskSchema = z.object({
  title: z.string().describe('The title of the task'),
  description: z
    .string()
    .optional()
    .describe('A brief description of the task'),
  status: z
    .enum(['TODO', 'COMPLETED'])
    .default('TODO')
    .describe('The current status of the task'),
  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH'])
    .default('MEDIUM')
    .describe('The priority level of the task'),
});

/**
 * Tool Category Factory Type.
 * A function that takes a userId and returns a record of AI tools.
 * Using factory pattern ensures that the userId is available to all tool execution functions.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- AI SDK tool registries use any for generality
type ToolCategoryFactory = (userId: string) => Record<string, any>;

/**
 * Task Management Tools.
 * This factory provides tools for creating, updating, deleting, and querying tasks.
 * All tools are scoped to the provided userId for security.
 */
export const taskTools: ToolCategoryFactory = (userId: string) => ({
  /**
   * createTasks: Allows the AI to create one or more tasks at once.
   */
  createTasks: {
    description: 'Create one or multiple new tasks.',
    parameters: z.object({
      tasks: z.array(taskSchema).describe('An array of tasks to create'),
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute: async (args: any) => {
      let tasks = args.tasks as unknown[];

      // Flexibility check: LLMs sometimes send a single object or an array directly
      // instead of wrapping it in a 'tasks' key. This block normalizes the input.
      if (!tasks) {
        if (args.title) {
          // If the root object looks like a single task
          tasks = [args] as unknown[];
        } else if (Array.isArray(args)) {
          // If the root object is an array of tasks
          tasks = args as unknown[];
        } else {
          return {
            success: false,
            error: "Invalid input: 'tasks' array is required.",
          };
        }
      }

      // Map over the tasks and create them in the database using Prisma
      const createdTasks = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tasks.map(async (task: any) => {
          // Validate each task against the schema
          const validatedTask = taskSchema.parse(task);
          return prisma.task.create({
            data: {
              ...validatedTask,
              userId, // Ensure the task belongs to the current user
            },
          });
        }),
      );
      return { success: true, tasks: createdTasks };
    },
  },

  /**
   * updateTasks: Allows the AI to modify existing tasks by ID.
   */
  updateTasks: {
    description: 'Update existing tasks by their IDs.',
    parameters: z.object({
      updates: z
        .array(
          z.object({
            id: z.string().describe('The UUID of the task to update'),
            updates: taskSchema.partial(), // Accepts a partial task object
          }),
        )
        .describe(
          "An array of task updates, each containing an 'id' and the 'updates' object",
        ),
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute: async (args: any) => {
      // Normalize input handles 'updates', 'tasks', or direct array inputs
      let updates = (args.updates ||
        args.tasks ||
        (Array.isArray(args) ? args : null)) as unknown[] | null;

      // Single update case: if 'id' is present at the root
      if (!updates && args.id) {
        updates = [args] as unknown[];
      }

      if (!updates || !Array.isArray(updates)) {
        return {
          success: false,
          error: "Invalid input: 'updates' array is required with task IDs.",
        };
      }

      // Execute all updates in parallel
      const updatedTasks = await Promise.all(
        (
          updates as Array<
            | { id: string; updates?: Partial<z.infer<typeof taskSchema>> }
            | z.infer<typeof taskSchema>
          >
        ).map(async (item) => {
          const id = (item as { id: string }).id;
          
          // Determine the source of updates. Support both:
          // 1. { id, updates: { title: '...' } } 
          // 2. { id, title: '...' }
          const taskUpdates = (
            item as { updates?: Partial<z.infer<typeof taskSchema>> }
          ).updates || { ...item };
          
          // Clean up the updates object if it still contains the ID (Prisma doesn't want ID in data field)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((taskUpdates as any).id) delete (taskUpdates as any).id;

          // Validate the partial updates
          const validatedUpdates = taskSchema.partial().parse(taskUpdates);

          // Perform the update in the database
          return prisma.task.update({
            where: { id, userId }, // Must match ID and userId for security
            data: validatedUpdates,
          });
        }),
      );
      return { success: true, tasks: updatedTasks };
    },
  },

  /**
   * deleteTasks: Allows the AI to remove tasks by their IDs.
   */
  deleteTasks: {
    description: 'Delete existing tasks by their IDs.',
    parameters: z.object({
      ids: z.array(z.string()).describe('List of task UUIDs to delete'),
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute: async (args: any) => {
      // Handle various parameter names used by LLMs
      let ids =
        args.ids ||
        args.id ||
        args.task_ids ||
        (Array.isArray(args) ? args : null);

      // Support single ID string input
      if (typeof ids === 'string') {
        ids = [ids] as string[];
      }

      if (!ids || !Array.isArray(ids)) {
        return {
          success: false,
          error: "Invalid input: 'ids' array is required.",
        };
      }

      // Bulk delete tasks belonging to this user
      await prisma.task.deleteMany({
        where: {
          id: { in: ids },
          userId,
        },
      });
      return { success: true, deletedIds: ids };
    },
  },

  /**
   * getTasks: Fetches all tasks associated with the current user.
   */
  getTasks: {
    description: 'Fetch all tasks for the current user.',
    parameters: z.object({}),
    execute: async () => {
      // Retrieval from Prisma ordered by creation date
      const tasks = await prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      return { success: true, tasks };
    },
  },

  /**
   * searchTasks: Performs an insensitive search across task titles and descriptions.
   */
  searchTasks: {
    description: 'Search for tasks by title or description query.',
    parameters: z.object({
      query: z
        .string()
        .describe('Text query to search for in titles and descriptions'),
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute: async ({ query }: any) => {
      const tasks = await prisma.task.findMany({
        where: {
          userId,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });
      return { success: true, tasks };
    },
  },
});

/**
 * Tools Registry.
 * A central collection of all tool factories. 
 * To add new functionality groups (e.g., CalendarTools, EmailTools), create a new factory 
 * and register it here.
 */
const registry: ToolCategoryFactory[] = [taskTools];

/**
 * Aggregates all registered tools into a single flat object for a specific user.
 * This is consumed by the LLM streamText or generateText functions.
 * 
 * @param userId - The ID of the user requesting tool access.
 * @returns A record of all executable AI tools merged together.
 */
export const getAllTools = (userId: string) => {
  return registry.reduce(
    (acc, getTools) => ({
      ...acc,
      ...getTools(userId),
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    {} as Record<string, any>,
  );
};
