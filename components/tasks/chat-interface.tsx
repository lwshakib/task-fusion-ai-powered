'use client';

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from '@/components/ai-elements/tool';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning';
import { Loader } from '@/components/ai-elements/loader';
import {
  AlertCircle,
  CheckCircle2,
  List,
  Search,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { PromptSuggestion } from '@/components/ai-elements/prompt-suggestion';
import { useTaskStore } from '@/context';
import { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { useRouter } from 'next/navigation';
import { MESSAGE_ROLE } from '@/generated/prisma/enums';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

/**
 * ChatInterface Component
 *
 * The primary interaction hub for the AI Task Fusion system.
 * This component orchestrates:
 * 1. AI Conversation: Streaming messages and reasoning using @ai-sdk/react.
 * 2. Tool Execution: Rendering specialized UI for task-related tool calls (CRUD operations).
 * 3. State Sync: Automatically applying AI-driven task changes to the local Zustand store.
 * 4. Persistence: Saving/Loading chat history via backend API routes.
 */

/**
 * Interface representing a part of an AI message.
 * Messages can contain multiple parts: plain text, reasoning blocks, or tool invocations.
 */
interface MessagePart {
  type: string;
  state?:
    | 'input-streaming'
    | 'input-available'
    | 'approval-requested'
    | 'output-available'
    | 'output-error';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- AI SDK tool parts have dynamic shapes
  input?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- AI SDK tool parts have dynamic shapes
  output?: any;
  errorText?: string;
  reasoning?: string;
  text?: string;
  isStreaming?: boolean;
  toolCallId?: string;
}

/**
 * TaskToolCall Component
 * A specialized renderer for task-related tool calls.
 * Instead of raw JSON, it provides tailored visual feedback for users.
 */
const TaskToolCall = ({ part }: { part: MessagePart }) => {
  const toolName = part.type.replace('tool-', '');
  const { state, input, output, errorText } = part;
  const isPending =
    state === 'input-streaming' ||
    state === 'input-available' ||
    state === 'approval-requested';
  const isSuccess = state === 'output-available' && !errorText;
  const isError = state === 'output-error' || !!errorText;

  // Visual for 'createTasks'
  if (toolName === 'createTasks') {
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
              Created task{createdTasks.length !== 1 ? 's' : ''} successfully
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

  // Visual for 'updateTasks'
  if (toolName === 'updateTasks') {
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
              Updated task{updatedTasks.length !== 1 ? 's' : ''} successfully
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

  // Visual for 'deleteTasks'
  if (toolName === 'deleteTasks') {
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
              {deletedIds.length !== 1 ? 's' : ''} successfully
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

  // Visual for 'getTasks'
  if (toolName === 'getTasks') {
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
            Found {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </span>
        </div>
      );
    }
  }

  // Visual for 'searchTasks'
  if (toolName === 'searchTasks') {
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
              Found {tasks.length} result{tasks.length !== 1 ? 's' : ''} for
              &quot;
              {(input as Record<string, string>)?.query || '...'}&quot;
            </span>
          </div>
        </div>
      );
    }
  }

  // Generalized Error View for complex tool failures
  if (isError) {
    const errorAction =
      toolName === 'searchTasks'
        ? 'search tasks'
        : toolName === 'getTasks'
          ? 'fetch tasks'
          : 'execute task action';
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

  /**
   * Generates a readable title for the tool header.
   */
  const getDisplayTitle = () => {
    switch (toolName) {
      case 'updateTasks':
        return 'Updating Tasks';
      case 'deleteTasks':
        return 'Deleting Tasks';
      case 'getTasks':
        return 'Fetching Tasks';
      case 'searchTasks':
        return `Searching for "${(input as Record<string, string>)?.query || '...'}"`;
      default:
        return toolName.replace(/([A-Z])/g, ' $1').trim();
    }
  };

  // Fallback to standard generic tool UI from ai-elements
  return (
    <Tool className="my-2" defaultOpen={isError}>
      <ToolHeader
        type={part.type as 'tool-createTasks'}
        state={state || 'input-streaming'}
        title={getDisplayTitle()}
      />
      <ToolContent>
        <ToolInput input={input} />
        <ToolOutput output={output} errorText={errorText} />
      </ToolContent>
    </Tool>
  );
};

// Initial suggestions shown in empty state
const TASK_SUGGESTIONS = [
  'Create a high priority task to finish the project report',
  'List all my pending tasks',
  "Mark my 'buy groceries' task as completed",
  'Search for tasks related to documentation',
  'Delete all tasks from last week',
];

export function ChatInterface() {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const { addTasks, updateTasks, removeTasks } = useTaskStore();

  // Track tool IDs that have already been synced with the local store to prevent duplicate state updates
  const processedToolInvocationIds = useRef(new Set<string>());
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  /**
   * AI Configuration:
   * Handles message streaming, database persistence, and specialized error handling (e.g., rate limits).
   */
  const { messages, sendMessage, status, setMessages } = useChat({
    onFinish: async (data) => {
      // 1. Save the AI's final multi-part message (text + tools) to the database history.
      const body = {
        parts: data.message.parts,
        role: MESSAGE_ROLE.assistant,
      };

      await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    },
    onError: (error) => {
      // User-friendly feedback for API errors or message limits.
      const isLimitError =
        error.message?.includes('limit') || error.message?.includes('403');

      toast.error(
        isLimitError ? 'Daily Limit Reached' : 'Failed to send message',
        {
          description: isLimitError
            ? 'You have reached your limit of 10 messages per day. Please upgrade your plan to continue.'
            : error.message ||
              'An unexpected error occurred. Please try again.',
          action: isLimitError
            ? {
                label: 'Upgrade Plan',
                onClick: () => router.push('/billing'),
              }
            : undefined,
        },
      );
    },
  });

  /**
   * Suggestion Click:
   * Triggers an AI message and local UI events (like updating usage counts).
   */
  const handleSuggestionClick = (text: string) => {
    sendMessage({ text });
    window.dispatchEvent(new CustomEvent('message-sent'));
  };

  /**
   * Initialization Logic:
   * Fetches existing chat history from the user's session.
   */
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/message');
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();

    // Reset listener for manual chat clearing
    const handleClearChat = () => {
      setMessages([]);
    };

    window.addEventListener('clear-chat', handleClearChat);
    return () => window.removeEventListener('clear-chat', handleClearChat);
  }, [setMessages]);

  /**
   * Tool Sync Logic:
   * Scans messages for successful tool outputs and applies the changes to the local task store.
   * This ensures the AI's "actions" are reflected in the UI immediately after execution.
   */
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- UIMessage parts are dynamic from the SDK
    messages.forEach((message: any) => {
      const parts = (message.parts as MessagePart[]) || [];
      parts.forEach((part: MessagePart) => {
        // Condition: Tool succeeded and hasn't been processed yet
        if (
          part.type.startsWith('tool-') &&
          part.state === 'output-available' &&
          part.toolCallId &&
          !processedToolInvocationIds.current.has(part.toolCallId)
        ) {
          const toolName = part.type.replace('tool-', '');
          const output = part.output;

          if (output?.success) {
            // Mapping tool results to Zustand store actions
            if (toolName === 'createTasks' && output.tasks) {
              addTasks(output.tasks);
            } else if (toolName === 'updateTasks' && output.tasks) {
              updateTasks(
                output.tasks.map(
                  (t: { id: string; [key: string]: unknown }) => ({
                    id: t.id,
                    updates: t,
                  }),
                ),
              );
            } else if (toolName === 'deleteTasks' && output.deletedIds) {
              removeTasks(output.deletedIds);
            }
          }
          // Mark as processed to prevent duplicate state manipulation
          processedToolInvocationIds.current.add(part.toolCallId);
        }
      });
    });
  }, [messages, addTasks, updateTasks, removeTasks]);

  /**
   * Auto-scroll Logic:
   * Keeps the most recent message in view during streaming.
   */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, status]);

  /**
   * User Prompt Submission:
   * Sends the text to the AI and triggers local message-sent orchestration.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- File attachments currently not implemented but types ready
  const handleSubmit = async (message: { text: string; files: any[] }) => {
    if (message.text.trim()) {
      try {
        await sendMessage({ text: message.text });
        setInputValue('');
        window.dispatchEvent(new CustomEvent('message-sent'));
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Chat error:', err.message);
        }
      }
    }
  };

  return (
    <div className="flex h-full flex-col bg-background relative shadow-inner overflow-hidden">
      <Conversation className="flex-1 overflow-hidden">
        <ConversationContent className="p-4 md:p-6 space-y-6">
          {loading ? (
            // Fetching state skeleton
            <div className="flex flex-col gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex gap-3',
                    i % 2 === 1 && 'flex-row-reverse',
                  )}
                >
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div
                    className={cn(
                      'space-y-2 flex-1 max-w-[80%]',
                      i % 2 === 1 && 'items-end flex flex-col',
                    )}
                  >
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            // Brand-centric Empty State
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
            // Full Conversation Rendering
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- AI SDK types
            messages.map((message: any) => {
              const parts = (message.parts as MessagePart[]) || [];

              return (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    {parts.map((part: MessagePart, i: number) => {
                      const key = `${message.id}-${i}`;

                      // AI Internal Monologue
                      if (part.type === 'reasoning') {
                        return (
                          <Reasoning key={key} isStreaming={!!part.isStreaming}>
                            <ReasoningTrigger />
                            <ReasoningContent>
                              {part.reasoning ?? part.text ?? ''}
                            </ReasoningContent>
                          </Reasoning>
                        );
                      }

                      // AI Direct Text Response
                      if (part.type === 'text') {
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

                      // AI Tool Visualizations
                      if (part.type.startsWith('tool-')) {
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

      {/* Persistent Prompt Section */}
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
                  status === 'streaming' || status === 'submitted'
                    ? status
                    : 'ready'
                }
                disabled={!inputValue.trim() && status === 'streaming'}
                className="size-9 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
              />
            </div>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
