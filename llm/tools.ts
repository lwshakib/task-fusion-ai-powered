import { z } from "zod";
import prisma from "@/lib/prisma";

export const taskSchema = z.object({
  title: z.string().describe("The title of the task"),
  description: z
    .string()
    .optional()
    .describe("A brief description of the task"),
  status: z
    .enum(["TODO", "COMPLETED"])
    .default("TODO")
    .describe("The current status of the task"),
  priority: z
    .enum(["LOW", "MEDIUM", "HIGH"])
    .default("MEDIUM")
    .describe("The priority level of the task"),
});

// Tool Category Factory Type
type ToolCategoryFactory = (userId: string) => Record<string, any>;

/**
 * Task Management Tools
 */
export const taskTools: ToolCategoryFactory = (userId: string) => ({
  createTasks: {
    description: "Create one or multiple new tasks.",
    parameters: z.object({
      tasks: z.array(taskSchema).describe("An array of tasks to create"),
    }),
    execute: async (args: any) => {
      let tasks = args.tasks;

      // Handle cases where the LLM might send a single task at the root or miss the 'tasks' key
      if (!tasks) {
        if (args.title) {
          tasks = [args];
        } else if (Array.isArray(args)) {
          tasks = args;
        } else {
          return {
            success: false,
            error: "Invalid input: 'tasks' array is required.",
          };
        }
      }

      const createdTasks = await Promise.all(
        tasks.map(async (task: any) => {
          const validatedTask = taskSchema.parse(task);
          return prisma.task.create({
            data: {
              ...validatedTask,
              userId,
            },
          });
        })
      );
      return { success: true, tasks: createdTasks };
    },
  },
  updateTasks: {
    description: "Update existing tasks by their IDs.",
    parameters: z.object({
      updates: z
        .array(
          z.object({
            id: z.string().describe("The UUID of the task to update"),
            updates: taskSchema.partial(),
          })
        )
        .describe(
          "An array of task updates, each containing an 'id' and the 'updates' object"
        ),
    }),
    execute: async (args: any) => {
      let updates =
        args.updates || args.tasks || (Array.isArray(args) ? args : null);

      if (!updates && args.id) {
        updates = [args];
      }

      if (!updates || !Array.isArray(updates)) {
        return {
          success: false,
          error: "Invalid input: 'updates' array is required with task IDs.",
        };
      }

      const updatedTasks = await Promise.all(
        updates.map(async (item: any) => {
          const id = item.id;
          // Support both { id, updates: { ... } } and { id, ...updates }
          const taskUpdates = item.updates || { ...item };
          if (taskUpdates.id) delete taskUpdates.id; // Remove ID from data if present

          const validatedUpdates = taskSchema.partial().parse(taskUpdates);

          return prisma.task.update({
            where: { id, userId },
            data: validatedUpdates,
          });
        })
      );
      return { success: true, tasks: updatedTasks };
    },
  },
  deleteTasks: {
    description: "Delete existing tasks by their IDs.",
    parameters: z.object({
      ids: z.array(z.string()).describe("List of task UUIDs to delete"),
    }),
    execute: async (args: any) => {
      let ids =
        args.ids ||
        args.id ||
        args.task_ids ||
        (Array.isArray(args) ? args : null);

      if (typeof ids === "string") {
        ids = [ids];
      }

      if (!ids || !Array.isArray(ids)) {
        return {
          success: false,
          error: "Invalid input: 'ids' array is required.",
        };
      }

      await prisma.task.deleteMany({
        where: {
          id: { in: ids },
          userId,
        },
      });
      return { success: true, deletedIds: ids };
    },
  },
  getTasks: {
    description: "Fetch all tasks for the current user.",
    parameters: z.object({}),
    execute: async () => {
      const tasks = await prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      return { success: true, tasks };
    },
  },
  searchTasks: {
    description: "Search for tasks by title or description query.",
    parameters: z.object({
      query: z
        .string()
        .describe("Text query to search for in titles and descriptions"),
    }),
    execute: async ({ query }: any) => {
      const tasks = await prisma.task.findMany({
        where: {
          userId,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        orderBy: { createdAt: "desc" },
      });
      return { success: true, tasks };
    },
  },
});

/**
 * Tools Registry
 * To add new functionality to the AI, create a new ToolCategoryFactory and add it to this array.
 */
const registry: ToolCategoryFactory[] = [taskTools];

/**
 * Aggregates all registered tools for a given user.
 * This is used in streamText.ts to provide the full tool suite to the LLM.
 */
export const getAllTools = (userId: string) => {
  return registry.reduce(
    (acc, getTools) => ({
      ...acc,
      ...getTools(userId),
    }),
    {} as Record<string, any>
  );
};
