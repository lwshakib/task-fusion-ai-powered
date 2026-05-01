import { z } from 'zod';
import prisma from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import {
  TASK_PRIORITY,
  TASK_STATUS,
} from '@/generated/prisma/enums';
import { FunctionDeclaration, Type } from '@google/genai';

/**
 * Zod Schemas for Task Operations with descriptions for the AI
 * These are used for runtime validation after the AI provides arguments.
 */

const TaskSchema = z.object({
  title: z.string().min(1, 'Title is required').describe('The title of the task'),
  description: z.string().optional().describe('Optional detailed description of the task'),
  status: z.nativeEnum(TASK_STATUS).default(TASK_STATUS.TODO).describe('The current status of the task'),
  priority: z.nativeEnum(TASK_PRIORITY).default(TASK_PRIORITY.MEDIUM).describe('The urgency level of the task'),
});

const CreateTasksSchema = z.object({
  tasks: z.array(TaskSchema).describe('An array of tasks to be created'),
});

const UpdateTasksSchema = z.object({
  updates: z.array(
    z.object({
      id: z.string().min(1, 'Task ID is required').describe('The unique identifier of the task to update'),
      updates: TaskSchema.partial().describe('The fields to update for this task'),
    }),
  ).describe('An array of task updates'),
});

const DeleteTasksSchema = z.object({
  ids: z.array(z.string()).describe('An array of task IDs to be permanently deleted'),
});

const SearchTasksSchema = z.object({
  query: z.string().min(1, 'Search query is required').describe('The keyword or phrase to search for in task titles and descriptions'),
});

/**
 * Tool Definitions (Function Declarations)
 * Manually defined according to @google/genai Type enum for maximum stability.
 */
export const toolDefinitions: FunctionDeclaration[] = [
  {
    name: 'createTasks',
    description: 'Create one or multiple new tasks in the system.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        tasks: {
          type: Type.ARRAY,
          description: 'An array of tasks to be created',
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'The title of the task' },
              description: { type: Type.STRING, description: 'Optional detailed description of the task' },
              status: { 
                type: Type.STRING, 
                description: 'The current status of the task',
                enum: ['TODO', 'COMPLETED']
              },
              priority: { 
                type: Type.STRING, 
                description: 'The urgency level of the task',
                enum: ['LOW', 'MEDIUM', 'HIGH']
              },
            },
            required: ['title'],
          },
        },
      },
      required: ['tasks'],
    },
  },
  {
    name: 'updateTasks',
    description: 'Update the properties of existing tasks using their IDs.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        updates: {
          type: Type.ARRAY,
          description: 'An array of task updates',
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: 'The unique identifier of the task to update' },
              updates: {
                type: Type.OBJECT,
                description: 'The fields to update for this task',
                properties: {
                  title: { type: Type.STRING, description: 'New title for the task' },
                  description: { type: Type.STRING, description: 'New description for the task' },
                  status: { type: Type.STRING, enum: ['TODO', 'COMPLETED'] },
                  priority: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH'] },
                },
              },
            },
            required: ['id', 'updates'],
          },
        },
      },
      required: ['updates'],
    },
  },
  {
    name: 'deleteTasks',
    description: 'Permanently remove tasks from the system by their IDs.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        ids: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'An array of task IDs to be permanently deleted',
        },
      },
      required: ['ids'],
    },
  },
  {
    name: 'getTasks',
    description: 'Retrieve all existing tasks for the current user.',
    parameters: { type: Type.OBJECT, properties: {} },
  },
  {
    name: 'searchTasks',
    description: 'Search for tasks that match a specific text query.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: { type: Type.STRING, description: 'The keyword or phrase to search for' },
      },
      required: ['query'],
    },
  },
];

/**
 * Tool Implementation Map
 */
export const toolHandlers = (userId: string) => ({
  createTasks: async (args: Record<string, unknown>) => {
    const { tasks } = CreateTasksSchema.parse(args);
    const createdTasks = await Promise.all(
      tasks.map((task) =>
        prisma.task.create({
          data: {
            ...task,
            userId,
          } as Prisma.TaskUncheckedCreateInput,
        }),
      ),
    );
    return { success: true, tasks: createdTasks };
  },
  updateTasks: async (args: Record<string, unknown>) => {
    const { updates } = UpdateTasksSchema.parse(args);
    const updatedTasks = await Promise.all(
      updates.map((item) =>
        prisma.task.update({
          where: { id: item.id, userId },
          data: item.updates,
        }),
      ),
    );
    return { success: true, tasks: updatedTasks };
  },
  deleteTasks: async (args: Record<string, unknown>) => {
    const { ids } = DeleteTasksSchema.parse(args);
    await prisma.task.deleteMany({
      where: {
        id: { in: ids },
        userId,
      },
    });
    return { success: true, deletedIds: ids };
  },
  getTasks: async () => {
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, tasks };
  },
  searchTasks: async (args: Record<string, unknown>) => {
    const { query } = SearchTasksSchema.parse(args);
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
});
