"use client";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";
import {
  AlertCircle,
  CheckCircle2,
  List,
  Search,
  Trash2,
  Sparkles,
} from "lucide-react";
import { PromptSuggestion } from "@/components/ai-elements/prompt-suggestion";
import { useTaskStore } from "@/context";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { MESSAGE_ROLE } from "@/generated/prisma/enums";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface MessagePart {
  type: string;
  state?:
    | "input-streaming"
    | "input-available"
    | "approval-requested"
    | "output-available"
    | "output-error";
  input?: any;
  output?: any;
  errorText?: string;
  reasoning?: string;
  text?: string;
  isStreaming?: boolean;
  toolCallId?: string;
}

/**
 * Custom renderer for task-related tool calls
 */
const TaskToolCall = ({ part }: { part: MessagePart }) => {
  const toolName = part.type.replace("tool-", "");
  const { state, input, output, errorText } = part;
  const isPending =
    state === "input-streaming" ||
    state === "input-available" ||
    state === "approval-requested";
  const isSuccess = state === "output-available" && !errorText;
  const isError = state === "output-error" || !!errorText;

  // Specific UI for createTasks as requested by the user
  if (toolName === "createTasks") {
    if (isPending) {
      return (
        <div className="flex items-center gap-2.5 px-3 py-1.5 my-2 rounded-full bg-primary/5 border border-primary/10 w-fit text-[13px] text-primary/80 animate-pulse">
          <Loader size={14} className="text-primary" />
          <span className="font-medium">Creating tasks...</span>
        </div>
      );
    }
    if (isSuccess) {
      const createdTasks = output?.tasks || [];
      return (
        <div className="flex flex-col gap-2 my-2 animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="flex items-center gap-2 text-[13px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50/50 dark:bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-100/50 dark:border-emerald-500/20 w-fit">
            <CheckCircle2 className="size-3.5" />
            <span>
              Created task{createdTasks.length !== 1 ? "s" : ""} successfully
            </span>
          </div>
          {createdTasks.length > 0 && (
            <div className="flex flex-wrap gap-2 px-1">
              {createdTasks.map((t: { id: string; title: string }) => (
                <div
                  key={t.id}
                  className="text-[11px] font-medium bg-background border border-border shadow-sm px-2.5 py-0.5 rounded-full flex items-center gap-1.5"
                >
                  <div className="size-1 rounded-full bg-emerald-500" />
                  {t.title}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    if (isError) {
      return (
        <div className="flex flex-col gap-1.5 my-2 animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="flex items-center gap-2 text-[13px] text-destructive font-semibold bg-destructive/5 dark:bg-destructive/10 px-3 py-1 rounded-lg border border-destructive/10 dark:border-destructive/20 w-fit">
            <AlertCircle className="size-3.5" />
            <span>Failed to create tasks</span>
          </div>
          {errorText && (
            <div className="text-[11px] text-muted-foreground px-1 max-w-70 wrap-break-word">
              {errorText}
            </div>
          )}
        </div>
      );
    }
  }

  // Specific UI for updateTasks
  if (toolName === "updateTasks") {
    if (isPending) {
      return (
        <div className="flex items-center gap-2.5 px-3 py-1.5 my-2 rounded-full bg-primary/5 border border-primary/10 w-fit text-[13px] text-primary/80 animate-pulse">
          <Loader size={14} className="text-primary" />
          <span className="font-medium">Updating tasks...</span>
        </div>
      );
    }
    if (isSuccess) {
      const updatedTasks = output?.tasks || [];
      return (
        <div className="flex flex-col gap-2 my-2 animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="flex items-center gap-2 text-[13px] text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-100/50 dark:border-blue-500/20 w-fit">
            <CheckCircle2 className="size-3.5" />
            <span>
              Updated task{updatedTasks.length !== 1 ? "s" : ""} successfully
            </span>
          </div>
          {updatedTasks.length > 0 && (
            <div className="flex flex-wrap gap-2 px-1">
              {updatedTasks.map((t: { id: string; title: string }) => (
                <div
                  key={t.id}
                  className="text-[11px] font-medium bg-background border border-border shadow-sm px-2.5 py-0.5 rounded-full flex items-center gap-1.5"
                >
                  <div className="size-1 rounded-full bg-blue-500" />
                  {t.title}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    if (isError) {
      return (
        <div className="flex flex-col gap-1.5 my-2 animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="flex items-center gap-2 text-[13px] text-destructive font-semibold bg-destructive/5 dark:bg-destructive/10 px-3 py-1 rounded-lg border border-destructive/10 dark:border-destructive/20 w-fit">
            <AlertCircle className="size-3.5" />
            <span>Failed to update tasks</span>
          </div>
          {errorText && (
            <div className="text-[11px] text-muted-foreground px-1 max-w-70 wrap-break-word">
              {errorText}
            </div>
          )}
        </div>
      );
    }
  }

  // Specific UI for deleteTasks
  if (toolName === "deleteTasks") {
    if (isPending) {
      return (
        <div className="flex items-center gap-2.5 px-3 py-1.5 my-2 rounded-full bg-primary/5 border border-primary/10 w-fit text-[13px] text-primary/80 animate-pulse">
          <Loader size={14} className="text-primary" />
          <span className="font-medium">Deleting tasks...</span>
        </div>
      );
    }
    if (isSuccess) {
      const deletedIds = output?.deletedIds || [];
      return (
        <div className="flex flex-col gap-2 my-2 animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="flex items-center gap-2 text-[13px] text-destructive font-semibold bg-destructive/5 px-3 py-1 rounded-lg border border-destructive/10 w-fit">
            <Trash2 className="size-3.5" />
            <span>
              Deleted {deletedIds.length} task
              {deletedIds.length !== 1 ? "s" : ""} successfully
            </span>
          </div>
        </div>
      );
    }
    if (isError) {
      return (
        <div className="flex flex-col gap-1.5 my-2 animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="flex items-center gap-2 text-[13px] text-destructive font-semibold bg-destructive/5 dark:bg-destructive/10 px-3 py-1 rounded-lg border border-destructive/10 dark:border-destructive/20 w-fit">
            <AlertCircle className="size-3.5" />
            <span>Failed to delete tasks</span>
          </div>
          {errorText && (
            <div className="text-[11px] text-muted-foreground px-1 max-w-70 wrap-break-word">
              {errorText}
            </div>
          )}
        </div>
      );
    }
  }

  // Specific UI for getTasks
  if (toolName === "getTasks") {
    if (isPending) {
      return (
        <div className="flex items-center gap-2.5 px-3 py-1.5 my-2 rounded-full bg-primary/5 border border-primary/10 w-fit text-[13px] text-primary/80 animate-pulse">
          <Loader size={14} className="text-primary" />
          <span className="font-medium">Fetching tasks...</span>
        </div>
      );
    }
    if (isSuccess) {
      const tasks = output?.tasks || [];
      return (
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground font-medium bg-muted/30 px-3 py-1 rounded-lg border border-muted-foreground/10 w-fit my-2">
          <List className="size-3.5" />
          <span>
            Found {tasks.length} task{tasks.length !== 1 ? "s" : ""}
          </span>
        </div>
      );
    }
  }

  // Specific UI for searchTasks
  if (toolName === "searchTasks") {
    if (isPending) {
      return (
        <div className="flex items-center gap-2.5 px-3 py-1.5 my-2 rounded-full bg-primary/5 border border-primary/10 w-fit text-[13px] text-primary/80 animate-pulse">
          <Loader size={14} className="text-primary" />
          <span className="font-medium">Searching tasks...</span>
        </div>
      );
    }
    if (isSuccess) {
      const tasks = output?.tasks || [];
      return (
        <div className="flex flex-col gap-1.5 my-2 animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="flex items-center gap-2 text-[13px] text-muted-foreground font-medium bg-muted/30 px-3 py-1 rounded-lg border border-muted-foreground/10 w-fit">
            <Search className="size-3.5" />
            <span>
              Found {tasks.length} result{tasks.length !== 1 ? "s" : ""} for "
              {input?.query || "..."}"
            </span>
          </div>
        </div>
      );
    }
  }

  // Handle errors for other task tools
  if (isError) {
    const errorAction =
      toolName === "searchTasks"
        ? "search tasks"
        : toolName === "getTasks"
        ? "fetch tasks"
        : "execute task action";
    return (
      <div className="flex flex-col gap-1.5 my-2 animate-in fade-in slide-in-from-top-1 duration-300">
        <div className="flex items-center gap-2 text-[13px] text-destructive font-semibold bg-destructive/5 dark:bg-destructive/10 px-3 py-1 rounded-lg border border-destructive/10 dark:border-destructive/20 w-fit">
          <AlertCircle className="size-3.5" />
          <span>Failed to {errorAction}</span>
        </div>
        {errorText && (
          <div className="text-[11px] text-muted-foreground px-1 max-w-70 wrap-break-word">
            {errorText}
          </div>
        )}
      </div>
    );
  }

  // Fallback to standard Tool UI for others
  const getDisplayTitle = () => {
    switch (toolName) {
      case "updateTasks":
        return "Updating Tasks";
      case "deleteTasks":
        return "Deleting Tasks";
      case "getTasks":
        return "Fetching Tasks";
      case "searchTasks":
        return `Searching for "${input?.query || "..."}"`;
      default:
        return toolName.replace(/([A-Z])/g, " $1").trim();
    }
  };

  return (
    <Tool className="my-2" defaultOpen={isError}>
      <ToolHeader
        type={part.type as any}
        state={state || "input-streaming"}
        title={getDisplayTitle()}
      />
      <ToolContent>
        <ToolInput input={input} />
        <ToolOutput output={output} errorText={errorText} />
      </ToolContent>
    </Tool>
  );
};

const TASK_SUGGESTIONS = [
  "Create a high priority task to finish the project report",
  "List all my pending tasks",
  "Mark my 'buy groceries' task as completed",
  "Search for tasks related to documentation",
  "Delete all tasks from last week",
];

export function ChatInterface() {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const { addTasks, updateTasks, removeTasks } = useTaskStore();
  const processedToolInvocationIds = useRef(new Set<string>());
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    onFinish: async (data) => {
      const body = {
        parts: data.message.parts,
        role: MESSAGE_ROLE.assistant,
      };

      await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    },
    onError: (error) => {
      toast.error("Failed to send message", {
        description:
          error.message || "An unexpected error occurred. Please try again.",
      });
    },
  });

  const handleSuggestionClick = (text: string) => {
    sendMessage({ text });
  };

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/message");
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();

    // Listen for clear-chat event
    const handleClearChat = () => {
      setMessages([]);
    };

    window.addEventListener("clear-chat", handleClearChat);
    return () => window.removeEventListener("clear-chat", handleClearChat);
  }, [setMessages]);

  // Sync task store with tool outputs
  useEffect(() => {
    messages.forEach((message: any) => {
      const parts = (message.parts as MessagePart[]) || [];
      parts.forEach((part: MessagePart) => {
        if (
          part.type.startsWith("tool-") &&
          part.state === "output-available" &&
          part.toolCallId &&
          !processedToolInvocationIds.current.has(part.toolCallId)
        ) {
          const toolName = part.type.replace("tool-", "");
          const output = part.output;

          if (output?.success) {
            if (toolName === "createTasks" && output.tasks) {
              addTasks(output.tasks);
            } else if (toolName === "updateTasks" && output.tasks) {
              updateTasks(
                output.tasks.map((t: { id: string; [key: string]: any }) => ({
                  id: t.id,
                  updates: t,
                }))
              );
            } else if (toolName === "deleteTasks" && output.deletedIds) {
              removeTasks(output.deletedIds);
            }
          }
          processedToolInvocationIds.current.add(part.toolCallId);
        }
      });
    });
  }, [messages, addTasks, updateTasks, removeTasks]);

  // Handle scrolling
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, status]);

  const handleSubmit = (message: { text: string; files: any[] }) => {
    if (message.text.trim()) {
      sendMessage({ text: message.text });
      setInputValue("");
    }
  };

  return (
    <div className="flex h-full flex-col bg-background relative shadow-inner overflow-hidden">
      <Conversation className="flex-1 overflow-hidden">
        <ConversationContent className="p-4 md:p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-3",
                    i % 2 === 1 && "flex-row-reverse"
                  )}
                >
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div
                    className={cn(
                      "space-y-2 flex-1 max-w-[80%]",
                      i % 2 === 1 && "items-end flex flex-col"
                    )}
                  >
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col h-full max-w-2xl mx-auto">
              <ConversationEmptyState
                icon={
                  <div className="p-4 rounded-full bg-primary/10 mb-4">
                    <List className="size-10 text-primary/60" />
                  </div>
                }
                title="Task Assistant"
                description="I'm here to help you manage your tasks. You can ask me to create, update, search or delete tasks."
              />

              <div className="mt-8 space-y-3 px-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  <Sparkles className="size-3 text-primary/60" />
                  Try asking
                </div>
                <div className="grid gap-2">
                  {TASK_SUGGESTIONS.map((suggestion) => (
                    <PromptSuggestion
                      key={suggestion}
                      highlight={inputValue}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="border-primary/5 bg-primary/5 hover:bg-primary/10 transition-all duration-200"
                    >
                      {suggestion}
                    </PromptSuggestion>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((message: any) => {
              const parts = (message.parts as MessagePart[]) || [];

              return (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    {parts.map((part: MessagePart, i: number) => {
                      const key = `${message.id}-${i}`;

                      if (part.type === "reasoning") {
                        return (
                          <Reasoning key={key} isStreaming={!!part.isStreaming}>
                            <ReasoningTrigger />
                            <ReasoningContent
                              children={part.reasoning ?? part.text ?? ""}
                            />
                          </Reasoning>
                        );
                      }

                      if (part.type === "text") {
                        if (!part.text?.trim()) return null;
                        return (
                          <MessageResponse
                            key={key}
                            className="leading-relaxed"
                          >
                            {part.text}
                          </MessageResponse>
                        );
                      }

                      if (part.type.startsWith("tool-")) {
                        return <TaskToolCall key={key} part={part} />;
                      }

                      return null;
                    })}
                  </MessageContent>
                </Message>
              );
            })
          )}
          <div ref={scrollRef} className="h-4" />
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="p-4 sticky bottom-0 z-10">
        <div className="max-w-2xl mx-auto">
          <PromptInput
            onSubmit={handleSubmit}
            onError={(err) => toast.error(err.message)}
            className="rounded-[22px] border-border shadow-sm focus-within:ring-1 focus-within:ring-primary/30 transition-all px-1"
          >
            <PromptInputTextarea
              value={inputValue}
              placeholder="How can I help with your tasks today?"
              onChange={(e) => setInputValue(e.currentTarget.value)}
              className="min-h-[56px] max-h-[200px] pr-14 py-3.5"
            />
            <div className="absolute bottom-1.5 right-1.5 flex items-center justify-center">
              <PromptInputSubmit
                status={
                  status === "streaming" || status === "submitted"
                    ? status
                    : "ready"
                }
                disabled={!inputValue.trim() && status === "streaming"}
                className="size-9 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
              />
            </div>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
