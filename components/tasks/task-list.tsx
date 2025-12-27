"use client";

import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  CalendarIcon,
  MoreHorizontalIcon,
  CircleIcon,
  CheckCircle2Icon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { TaskDialog } from "./task-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useTaskStore, Task } from "@/context";

export function TaskList() {
  const { tasks, setTasks, removeTask } = useTaskStore();
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id: string) => {
    const previousTasks = [...tasks];
    try {
      // Optimistic update
      removeTask(id);

      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete task");

      toast.success("Task deleted");
    } catch (error) {
      // Rollback
      setTasks(previousTasks);
      toast.error("Failed to delete task");
    }
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedTask(undefined);
    setIsDialogOpen(true);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your daily goals and assignments.
          </p>
        </div>
        <Button size="sm" onClick={handleCreate}>
          <PlusIcon className="mr-2 size-4" /> New Task
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground border border-dashed rounded-lg bg-muted/20">
              <p className="mb-2">No tasks found</p>
              <Button variant="outline" size="sm" onClick={handleCreate}>
                Create your first task
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex items-center gap-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground hover:text-primary"
                  >
                    {task.status === "COMPLETED" ? (
                      <CheckCircle2Icon className="size-5 text-green-500" />
                    ) : (
                      <CircleIcon className="size-5" />
                    )}
                  </Button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          "font-medium truncate",
                          task.status === "COMPLETED" &&
                            "line-through text-muted-foreground"
                        )}
                      >
                        {task.title}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "capitalize text-[10px] h-5 px-1.5 font-normal",
                          task.priority === "HIGH"
                            ? "border-red-200 text-red-700 bg-red-50"
                            : task.priority === "MEDIUM"
                            ? "border-yellow-200 text-yellow-700 bg-yellow-50"
                            : "border-green-200 text-green-700 bg-green-50"
                        )}
                      >
                        {task.priority.toLowerCase()}
                      </Badge>
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground truncate">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-muted-foreground text-sm shrink-0">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="size-3.5" />
                      <span>
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(task)}>
                          <PencilIcon className="mr-2 size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDelete(task.id)}
                        >
                          <TrashIcon className="mr-2 size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={selectedTask}
        onSuccess={fetchTasks}
      />
    </div>
  );
}
