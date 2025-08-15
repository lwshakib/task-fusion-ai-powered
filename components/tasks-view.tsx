import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ChevronDown, Circle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTasks } from "./task-provider";

interface Task {
  id: string;
  task: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  priority: "LOW" | "MEDIUM" | "HIGH";
  completed: boolean;
}

const getPriorityColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "HIGH":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
    case "LOW":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
  }
};

export default function TasksView() {
  const {
    tasks,
    loading,
    sortBy,
    setSortBy,
    createNewTask: createTaskFromProvider,
    updateTask: updateTaskFromProvider,
    toggleTaskCompletion: toggleTaskFromProvider,
    deleteTask: deleteTaskFromProvider,
    sortedTasks,
  } = useTasks();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editForm, setEditForm] = useState({
    task: "",
    description: "",
    priority: "MEDIUM" as Task["priority"],
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    task: "",
    description: "",
    priority: "MEDIUM" as Task["priority"],
  });
  const [editingPopoverOpen, setEditingPopoverOpen] = useState(false);

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setEditForm({
      task: task.task,
      description: task.description || "",
      priority: task.priority,
    });
  };

  const saveTaskEdit = async () => {
    if (editingTask) {
      await updateTaskFromProvider(
        editingTask.id,
        editForm.task,
        editForm.priority,
        editForm.description
      );
      setEditingTask(null);
      setEditForm({ task: "", description: "", priority: "MEDIUM" });
      setEditingPopoverOpen(false);
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditForm({ task: "", description: "", priority: "MEDIUM" });
    setEditingPopoverOpen(false);
  };

  const handleCreateTask = async () => {
    if (!createForm.task.trim()) return;

    await createTaskFromProvider(
      createForm.task,
      createForm.priority,
      createForm.description
    );
    setCreateForm({ task: "", description: "", priority: "MEDIUM" });
    setShowCreateForm(false);
  };

  const cancelCreate = () => {
    setCreateForm({ task: "", description: "", priority: "MEDIUM" });
    setShowCreateForm(false);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTaskFromProvider(taskId);
  };

  if (loading) {
    return (
      <div className="h-full p-6">
        {/* Header skeleton */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-24 bg-muted animate-pulse rounded"></div>
              <div className="h-9 w-40 bg-muted animate-pulse rounded"></div>
            </div>
          </div>
          <div className="h-5 w-64 bg-muted animate-pulse rounded"></div>
        </div>

        {/* Task items skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg bg-card animate-pulse"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-0.5 h-5 w-5 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <div className="h-6 w-16 bg-muted rounded-full"></div>
                  <div className="h-6 w-6 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">Tasks</h2>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setShowCreateForm(true)}>
              Create Task
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  Sort by:{" "}
                  {sortBy === "priority"
                    ? "Priority (High to Low)"
                    : sortBy === "priority-desc"
                    ? "Priority (Low to High)"
                    : sortBy === "createdAt"
                    ? "Created (Newest First)"
                    : "Created (Oldest First)"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("priority")}>
                  Priority (High to Low)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("priority-desc")}>
                  Priority (Low to High)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("createdAt")}>
                  Created (Newest First)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("createdAt-desc")}>
                  Created (Oldest First)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className="text-muted-foreground">
          {sortedTasks && sortedTasks.length} tasks •{" "}
          {
            sortedTasks && sortedTasks.filter((t) => t.priority === "HIGH" && !t.completed)
              .length
          }{" "}
          high priority pending •{" "}
          {sortedTasks && sortedTasks.filter((t) => t.completed).length} completed
        </p>
      </div>

      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Task Title
              </label>
              <input
                type="text"
                value={createForm.task}
                onChange={(e) =>
                  setCreateForm({ ...createForm, task: e.target.value })
                }
                className="w-full p-2 border rounded-md"
                placeholder="Enter task title"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Priority</label>
              <Select
                value={createForm.priority}
                onValueChange={(value) =>
                  setCreateForm({
                    ...createForm,
                    priority: value as Task["priority"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Description (Optional)
              </label>
              <Textarea
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    description: e.target.value,
                  })
                }
                placeholder="Enter task description"
                className="min-h-[100px]"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={cancelCreate}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleCreateTask}>
                Create Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {tasks && tasks.length === 0 ? (
        <div className="h-[calc(100vh-200px)] flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">No tasks yet</p>
            <p className="text-sm text-muted-foreground">
              Create your first task to get started
            </p>
          </div>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-3 pr-4">
            {sortedTasks && sortedTasks.length > 0 && sortedTasks.map((task) => (
              <Popover
                key={task.id}
                open={editingPopoverOpen && editingTask?.id === task.id}
                onOpenChange={(open) => {
                  if (open) {
                    openEditTask(task);
                    setEditingPopoverOpen(true);
                  } else {
                    setEditingPopoverOpen(false);
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <div
                    className={`p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors cursor-pointer ${
                      task.completed ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <button
                          className="mt-0.5 hover:scale-110 transition-transform"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTaskFromProvider(task.id);
                          }}
                        >
                          {task.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                          )}
                        </button>
                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              task.completed ? "line-through" : ""
                            }`}
                          >
                            {task.task}
                          </p>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                        <button
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task.id);
                          }}
                          title="Delete task"
                        >
                          <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
                        </button>
                      </div>
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-96" align="start">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Edit Task</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Task Title
                          </label>
                          <input
                            type="text"
                            value={editForm.task}
                            onChange={(e) =>
                              setEditForm({ ...editForm, task: e.target.value })
                            }
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter task title"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Priority
                          </label>
                          <Select
                            value={editForm.priority}
                            onValueChange={(value) =>
                              setEditForm({
                                ...editForm,
                                priority: value as Task["priority"],
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="LOW">Low</SelectItem>
                              <SelectItem value="MEDIUM">Medium</SelectItem>
                              <SelectItem value="HIGH">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Description (Optional)
                          </label>
                          <Textarea
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                description: e.target.value,
                              })
                            }
                            placeholder="Enter task description"
                            className="min-h-[100px]"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={cancelEdit}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={saveTaskEdit}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
