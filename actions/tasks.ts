"use server";
import { prisma } from "@/lib/prisma";
import { checkUser } from "./user";

type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

/**
 * Validates task priority
 */
function validatePriority(priority: string): TaskPriority {
  const normalized = priority.toUpperCase().trim() as TaskPriority;
  if (["LOW", "MEDIUM", "HIGH"].includes(normalized)) {
    return normalized;
  }
  return "MEDIUM"; // Default to MEDIUM if invalid
}

/**
 * Validates ID format (supports both CUID and UUID)
 * CUID format: typically starts with 'c' and is 25 chars
 * UUID format: standard UUID v4 format
 */
function validateID(id: string): boolean {
  if (!id || typeof id !== "string" || id.trim().length === 0) {
    return false;
  }

  const trimmedId = id.trim();

  // CUID validation (Prisma default) - typically 25 chars, starts with 'c'
  // CUIDs are alphanumeric and can contain hyphens
  const cuidRegex = /^c[a-z0-9]{24}$/i;
  if (cuidRegex.test(trimmedId)) {
    return true;
  }

  // UUID v4 validation (fallback for other formats)
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(trimmedId)) {
    return true;
  }

  // More lenient CUID check (in case format varies)
  // CUIDs are usually 20-25 characters, alphanumeric
  if (trimmedId.length >= 20 && trimmedId.length <= 30 && /^[a-z0-9-]+$/i.test(trimmedId)) {
    return true;
  }

  return false;
}

/**
 * Creates a new task
 * @param task - Task title
 * @param priority - Task priority (LOW, MEDIUM, HIGH)
 * @param description - Optional task description
 * @returns Created task or null if user not authenticated
 * @throws Error if validation fails or database operation fails
 */
export const createTask = async (
  task: string,
  priority: string,
  description: string
) => {
  try {
    // Input validation
    if (!task || typeof task !== "string" || task.trim().length === 0) {
      throw new Error("Task title is required and must be non-empty");
    }

    if (task.length > 500) {
      throw new Error("Task title must be less than 500 characters");
    }

    if (description && description.length > 5000) {
      throw new Error("Task description must be less than 5000 characters");
    }

    const user = await checkUser();
    if (!user) {
      return null;
    }

    const validatedPriority = validatePriority(priority);

    const newTask = await prisma.task.create({
      data: {
        task: task.trim(),
        priority: validatedPriority,
        description: description?.trim() || null,
        clerkId: user.clerkId,
      },
    });

    return newTask;
  } catch (error) {
    console.error("Error creating task:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }
    throw new Error("Failed to create task: Unknown error");
  }
};

/**
 * Retrieves all tasks for the current user
 * @returns Array of tasks or null if user not authenticated
 * @throws Error if database operation fails
 */
export const getTasks = async () => {
  try {
    const user = await checkUser();
    if (!user) {
      return null;
    }

    const tasks = await prisma.task.findMany({
      where: { clerkId: user.clerkId },
      orderBy: { createdAt: "desc" },
    });

    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }
    throw new Error("Failed to fetch tasks: Unknown error");
  }
};

/**
 * Updates an existing task
 * @param id - Task ID (UUID)
 * @param task - Updated task title
 * @param priority - Updated task priority
 * @param description - Updated task description
 * @param completed - Optional completion status
 * @returns Updated task or null if user not authenticated or task not found
 * @throws Error if validation fails or database operation fails
 */
export const updateTask = async (
  id: string,
  task: string,
  priority: string,
  description: string,
  completed?: boolean
) => {
  try {
    // Input validation
    if (!id || !validateID(id)) {
      throw new Error(`Valid task ID is required. Received: ${id || "undefined"}`);
    }

    if (!task || typeof task !== "string" || task.trim().length === 0) {
      throw new Error("Task title is required and must be non-empty");
    }

    if (task.length > 500) {
      throw new Error("Task title must be less than 500 characters");
    }

    if (description && description.length > 5000) {
      throw new Error("Task description must be less than 5000 characters");
    }

    const user = await checkUser();
    if (!user) {
      return null;
    }

    const validatedPriority = validatePriority(priority);

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { id, clerkId: user.clerkId },
    });

    if (!existingTask) {
      throw new Error("Task not found or access denied");
    }

    const updateData: {
      task: string;
      priority: TaskPriority;
      description: string | null;
      completed?: boolean;
    } = {
      task: task.trim(),
      priority: validatedPriority,
      description: description?.trim() || null,
    };

    if (completed !== undefined) {
      updateData.completed = completed;
    }

    const updatedTask = await prisma.task.update({
      where: { id, clerkId: user.clerkId },
      data: updateData,
    });

    return updatedTask;
  } catch (error) {
    console.error("Error updating task:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to update task: ${error.message}`);
    }
    throw new Error("Failed to update task: Unknown error");
  }
};

/**
 * Deletes a task
 * @param id - Task ID (UUID)
 * @returns Deleted task or null if user not authenticated or task not found
 * @throws Error if validation fails or database operation fails
 */
export const deleteTask = async (id: string) => {
  try {
    // Input validation
    if (!id || !validateID(id)) {
      throw new Error(`Valid task ID is required. Received: ${id || "undefined"}`);
    }

    const user = await checkUser();
    if (!user) {
      return null;
    }

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { id, clerkId: user.clerkId },
    });

    if (!existingTask) {
      throw new Error("Task not found or access denied");
    }

    const deletedTask = await prisma.task.delete({
      where: { id, clerkId: user.clerkId },
    });

    return deletedTask;
  } catch (error) {
    console.error("Error deleting task:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to delete task: ${error.message}`);
    }
    throw new Error("Failed to delete task: Unknown error");
  }
};

/**
 * Toggles task completion status
 * @param id - Task ID (UUID)
 * @param completed - Completion status
 * @returns Updated task or null if user not authenticated or task not found
 * @throws Error if validation fails or database operation fails
 */
export const toggleTaskCompletion = async (
  id: string,
  completed: boolean
) => {
  try {
    // Input validation
    if (!id || !validateID(id)) {
      throw new Error(`Valid task ID is required. Received: ${id || "undefined"}`);
    }

    if (typeof completed !== "boolean") {
      throw new Error("Completed status must be a boolean");
    }

    const user = await checkUser();
    if (!user) {
      return null;
    }

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { id, clerkId: user.clerkId },
    });

    if (!existingTask) {
      throw new Error("Task not found or access denied");
    }

    const updatedTask = await prisma.task.update({
      where: { id, clerkId: user.clerkId },
      data: { completed },
    });

    return updatedTask;
  } catch (error) {
    console.error("Error toggling task completion:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to toggle task completion: ${error.message}`);
    }
    throw new Error("Failed to toggle task completion: Unknown error");
  }
};
