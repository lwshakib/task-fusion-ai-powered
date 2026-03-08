import { create } from 'zustand';

/**
 * Task Interface.
 * Defines the structure of a single task in the application.
 */
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'TODO' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  updatedAt: string;
}

/**
 * Task Store State Interface.
 * Defines the state properties and action functions available in the Task Store.
 */
interface TaskState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  addTasks: (tasks: Task[]) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  updateTasks: (updates: { id: string; updates: Partial<Task> }[]) => void;
  removeTask: (id: string) => void;
  removeTasks: (ids: string[]) => void;
}

/**
 * useTaskStore Hook.
 * A Zustand-based store for global task state management.
 * This hook replaces the previous React Context implementation for better performance 
 * and developer experience.
 */
export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],

  /**
   * Resets the entire task list.
   */
  setTasks: (tasks) => set({ tasks }),

  /**
   * Adds a single task. If the task already exists (by ID), it updates it and moves it to the top.
   */
  addTask: (task) =>
    set((state) => ({
      tasks: [task, ...state.tasks.filter((t) => t.id !== task.id)],
    })),

  /**
   * Batch adds multiple tasks, preventing duplicates by ID.
   */
  addTasks: (newTasks) =>
    set((state) => {
      const newIds = new Set(newTasks.map((t) => t.id));
      return {
        tasks: [...newTasks, ...state.tasks.filter((t) => !newIds.has(t.id))],
      };
    }),

  /**
   * Updates a specific task by ID with partial data.
   */
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  /**
   * Batch updates multiple tasks.
   */
  updateTasks: (batchUpdates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => {
        const update = batchUpdates.find((u) => u.id === t.id);
        return update ? { ...t, ...update.updates } : t;
      }),
    })),

  /**
   * Removes a single task by ID.
   */
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),

  /**
   * Batch removes multiple tasks by their IDs.
   */
  removeTasks: (ids) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => !ids.includes(t.id)),
    })),
}));
