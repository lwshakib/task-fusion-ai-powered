import { create } from "zustand";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "TODO" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdAt: string;
  updatedAt: string;
}

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

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  addTasks: (newTasks) =>
    set((state) => ({ tasks: [...newTasks, ...state.tasks] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  updateTasks: (batchUpdates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => {
        const update = batchUpdates.find((u) => u.id === t.id);
        return update ? { ...t, ...update.updates } : t;
      }),
    })),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),
  removeTasks: (ids) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => !ids.includes(t.id)),
    })),
}));
