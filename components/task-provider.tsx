"use client";
import { createMessage, getMessages } from "@/actions/message";
import {
  createTask,
  deleteTask,
  getTasks,
  toggleTaskCompletion as toggleTaskCompletionAction,
  updateTask,
} from "@/actions/tasks";
import { parseArtifactResponse } from "@/lib/parser";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface Task {
  id: string;
  task: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  priority: "LOW" | "MEDIUM" | "HIGH";
  completed: boolean;
}

interface Message {
  id: string;
  content: string;
  sender: string;
  createdAt: Date;
  updatedAt: Date;
}

type SortOption = "priority" | "createdAt" | "priority-desc" | "createdAt-desc";

interface TaskContextType {
  tasks: Task[];
  messages: Message[];
  loading: boolean;
  messagesLoading: boolean;
  sortBy: SortOption;
  setSortBy: (sortBy: SortOption) => void;
  loadTasks: () => Promise<void>;
  loadMessages: () => Promise<void>;
  createNewTask: (
    task: string,
    priority: Task["priority"],
    description: string
  ) => Promise<void>;
  updateTask: (
    id: string,
    task: string,
    priority: Task["priority"],
    description: string,
    completed?: boolean
  ) => Promise<void>;
  toggleTaskCompletion: (taskId: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  handleAiInput: (text: string) => void;
  sortedTasks: Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const sortTasks = (tasks: Task[], sortBy: SortOption) => {
  const sortedTasks = [...tasks];

  // First, sort by completion status (completed tasks go to bottom)
  const completedTasks = sortedTasks.filter((task) => task.completed);
  const pendingTasks = sortedTasks.filter((task) => !task.completed);

  // Sort pending tasks by the selected criteria
  let sortedPendingTasks: Task[];
  switch (sortBy) {
    case "priority":
      sortedPendingTasks = pendingTasks.sort((a, b) => {
        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
      break;
    case "priority-desc":
      sortedPendingTasks = pendingTasks.sort((a, b) => {
        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
      break;
    case "createdAt":
      sortedPendingTasks = pendingTasks.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
      break;
    case "createdAt-desc":
      sortedPendingTasks = pendingTasks.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      );
      break;
    default:
      sortedPendingTasks = pendingTasks;
  }

  // Sort completed tasks by completion time (most recently completed first)
  const sortedCompletedTasks = completedTasks.sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  );

  // Return pending tasks first, then completed tasks
  return [...sortedPendingTasks, ...sortedCompletedTasks];
};

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("priority");
  const [messages, setMessages] = useState<any[]>([]);
  const { user } = useUser();

  const loadTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await getTasks();
      if (fetchedTasks) {
        // Convert database types to match our interface
        const convertedTasks = fetchedTasks.map((task) => ({
          ...task,
          description: task.description || undefined,
          priority: task.priority as "LOW" | "MEDIUM" | "HIGH",
        }));
        setTasks(convertedTasks);
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      setMessagesLoading(true);
      const fetchedMessages = await getMessages();
      setMessages(fetchedMessages as any);
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const createNewTask = async (
    task: string,
    priority: Task["priority"],
    description: string
  ) => {
    await toast.promise(
      createTask(task, priority, description).then((result) => {
        if (result) {
          const newTask = {
            ...result,
            description: result.description || undefined,
            priority: result.priority as "LOW" | "MEDIUM" | "HIGH",
          };
          setTasks((prevTasks) => [newTask, ...prevTasks]);
        }
      }),
      {
        loading: "Creating task...",
        success: "Task created successfully",
        error: "Failed to create task",
      }
    );
  };

  const updateTaskById = async (
    id: string,
    task: string,
    priority: Task["priority"],
    description: string,
    completed?: boolean
  ) => {
    await toast.promise(
      updateTask(id, task, priority, description, completed).then((result) => {
        if (result) {
          setTasks((prevTasks) =>
            prevTasks.map((t) =>
              t.id === id
                ? {
                    ...t,
                    task,
                    priority,
                    description,
                    ...(completed !== undefined && { completed }),
                    updatedAt: new Date(),
                  }
                : t
            )
          );
        }
      }),
      {
        loading: "Updating task...",
        success: "Task updated successfully!",
        error: "Failed to update task",
      }
    );
  };

  const toggleTaskCompletion = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    await toast.promise(
      toggleTaskCompletionAction(taskId, !task.completed).then((result) => {
        if (result) {
          setTasks((prevTasks) =>
            prevTasks.map((t) =>
              t.id === taskId
                ? { ...t, completed: !t.completed, updatedAt: new Date() }
                : t
            )
          );
        }
      }),
      {
        loading: task.completed
          ? "Marking as incomplete..."
          : "Marking as complete...",
        success: task.completed
          ? "Task marked as incomplete"
          : "Task marked as complete",
        error: "Failed to update task status",
      }
    );
  };

  const deleteTaskById = async (id: string) => {
    setTasks((prevTasks) => {
      const newTasks = prevTasks.filter((task) => task.id !== id);
      return newTasks;
    });
    await deleteTask(id);
  };

  const handleAiInput = async (text: string) => {
    try {
      // Create user message immediately in UI for instant feedback
      const tempUserMessage = {
        id: `temp-${Date.now()}`,
        content: text,
        sender: "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setMessages((prev: any) => [...prev, tempUserMessage]);

      // Create user message in database
      const userMessage = await createMessage("USER", text);
      if (userMessage) {
        // Replace temp message with real one from database
        setMessages((prev: any) =>
          prev.map((msg: any) =>
            msg.id === tempUserMessage.id ? userMessage : msg
          )
        );
      }

      // Get the last 5 messages for conversation context (including the one we just added)
      const conversationHistory = [...messages, tempUserMessage].slice(-5);

      // Add loading message for AI response
      const tempAiMessage = {
        id: `temp-ai-${Date.now()}`,
        content: "Thinking...",
        sender: "AI",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setMessages((prev: any) => [...prev, tempAiMessage]);

      const { data } = await axios.post("/api/ai/response", {
        text,
        tasks,
        conversationHistory,
      });
      const parsed = parseArtifactResponse(data.text);

      // Log any parsing errors or warnings
      if (parsed.errors && parsed.errors.length > 0) {
        console.warn("Parser errors:", parsed.errors);
      }
      if (parsed.warnings && parsed.warnings.length > 0) {
        console.warn("Parser warnings:", parsed.warnings);
      }

      // Process tasks from AI response
      for (const task of parsed.tasks) {
        switch (task.type) {
          case "create":
            await createNewTask(
              task.content,
              task.priority || "MEDIUM",
              task.description || ""
            );
            break;
          case "update":
            if (task.id) {
              // Validate that the task ID exists in our current tasks
              let existingTask = tasks.find((t) => t.id === task.id);

              // If ID not found, try to find by task content (fallback for AI mistakes)
              if (!existingTask && task.content) {
                const foundTask = findTaskByText(task.content);
                if (foundTask) {
                  console.warn(
                    `AI provided ID "${task.id}" not found, but found task by content: "${foundTask.task}" with ID "${foundTask.id}"`
                  );
                  task.id = foundTask.id; // Update the task ID to the correct one
                  existingTask = foundTask;
                }
              }

              if (!existingTask) {
                console.error(
                  `Update failed: Task ID "${task.id}" not found in current tasks`
                );
                console.error(
                  "Available tasks:",
                  tasks.map((t) => ({ id: t.id, task: t.task }))
                );
                toast.error(`Cannot update task: ID "${task.id}" not found`);
                continue;
              }

              await updateTaskById(
                task.id,
                task.content,
                task.priority || existingTask.priority,
                task.description || existingTask.description || "",
                task.completed // Pass completed status from AI response
              );
            } else {
              console.error("Update task missing ID");
              toast.error("Cannot update task: missing ID");
            }
            break;
          case "delete":
            if (task.id) {
              // Validate that the task ID exists in our current tasks
              let existingTask = tasks.find((t) => t.id === task.id);

              // If ID not found, try to find by task content (fallback for AI mistakes)
              if (!existingTask && task.content) {
                const foundTask = findTaskByText(task.content);
                if (foundTask) {
                  console.warn(
                    `AI provided ID "${task.id}" not found, but found task by content: "${foundTask.task}" with ID "${foundTask.id}"`
                  );
                  task.id = foundTask.id; // Update the task ID to the correct one
                  existingTask = foundTask;
                }
              }

              if (!existingTask) {
                console.error(
                  `Delete failed: Task ID "${task.id}" not found in current tasks`
                );
                console.error(
                  "Available tasks:",
                  tasks.map((t) => ({ id: t.id, task: t.task }))
                );
                toast.error(`Cannot delete task: ID "${task.id}" not found`);
                continue;
              }

              await deleteTaskById(task.id);
            } else {
              console.error("Delete task missing ID");
              toast.error("Cannot delete task: missing ID");
            }
            break;
        }
      }

      // Remove the temporary "Thinking..." message
      setMessages((prev) => prev.filter((msg) => msg.id !== tempAiMessage.id));

      // Process AI responses and add them immediately to UI
      for (const response of parsed.responses) {
        // Add AI response immediately to UI for instant feedback
        const tempAiResponse = {
          id: `temp-ai-response-${Date.now()}`,
          content: response.content,
          sender: "AI",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setMessages((prev) => [...prev, tempAiResponse]);

        // Create AI message in database
        const aiMessage = await createMessage("AI", response.content);
        if (aiMessage) {
          // Replace temp message with real one from database
          setMessages((prev) =>
            prev.map((msg) => (msg.id === tempAiResponse.id ? aiMessage : msg))
          );
        }
      }
    } catch (error) {
      console.error("AI Input processing error:", error);
      toast.error("Failed to process AI input");
    }
  };

  const sortedTasks = sortTasks(tasks, sortBy);

  // Helper function to find task by partial text match
  const findTaskByText = (searchText: string): Task | null => {
    const normalizedSearch = searchText.toLowerCase().trim();

    // First try exact match
    const exactMatch = tasks.find(
      (task) => task.task.toLowerCase() === normalizedSearch
    );
    if (exactMatch) {
      return exactMatch;
    }

    // Then try partial match
    const partialMatch = tasks.find(
      (task) =>
        task.task.toLowerCase().includes(normalizedSearch) ||
        normalizedSearch.includes(task.task.toLowerCase())
    );
    if (partialMatch) {
      return partialMatch;
    }

    // Finally try fuzzy match on words
    const searchWords = normalizedSearch.split(/\s+/);
    const bestMatch = tasks.find((task) => {
      const taskWords = task.task.toLowerCase().split(/\s+/);
      const matchScore = searchWords.filter((word) =>
        taskWords.some(
          (taskWord) => taskWord.includes(word) || word.includes(taskWord)
        )
      ).length;
      return matchScore >= Math.ceil(searchWords.length / 2);
    });

    if (bestMatch) {
      return bestMatch;
    }

    return null;
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load both tasks and messages in parallel
        await Promise.all([loadTasks(), loadMessages()]);
      } catch (error) {
        console.error("Failed to initialize data:", error);
      }
    };
    initializeData();
  }, []);

  const value: TaskContextType = {
    tasks,
    messages,
    loading,
    messagesLoading,
    sortBy,
    setSortBy,
    loadTasks,
    loadMessages,
    createNewTask,
    updateTask: updateTaskById,
    toggleTaskCompletion,
    deleteTask: deleteTaskById,
    handleAiInput,
    sortedTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
