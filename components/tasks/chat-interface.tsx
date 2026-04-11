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
import { useTaskStore, type Task } from '@/hooks/use-task-store';
import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';
import { nanoid } from 'nanoid';

/**
 * ChatInterface Component
 *
 * The primary interaction hub for the AI Task Fusion system.
 * This component orchestrates AI interaction without Vercel AI SDK.
 */

interface MessagePart {
  type: string;
  state?:
    | 'input-streaming'
    | 'input-available'
    | 'approval-requested'
    | 'output-available'
    | 'output-error';
  input?: unknown;
  output?: unknown;
  errorText?: string;
  reasoning?: string;
  text?: string;
  isStreaming?: boolean;
  toolCallId?: string;
}

interface UIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  parts: MessagePart[];
  createdAt?: Date;
}

const TaskToolCall = ({ part }: { part: MessagePart }) => {
  const toolName = part.type.replace('tool-', '');
  const { state, input, output, errorText } = part;
  const isPending =
    state === 'input-streaming' ||
    state === 'input-available' ||
    state === 'approval-requested';
  const isSuccess = state === 'output-available' && !errorText;
  const isError = state === 'output-error' || !!errorText;

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
      const outputData = output as { tasks?: { id: string; title: string }[] };
      const createdTasks = outputData?.tasks || [];
      return (
        <div className="flex flex-col gap-2 my-2 animate-in fade-in slide-in-from-top-1 duration-300 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50/50 dark:bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-100/50 dark:border-emerald-500/20 w-fit max-w-full">
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
            <div className="text-[11px] text-muted-foreground px-1 max-w-full break-words">
              {errorText}
            </div>
          )}
        </div>
      );
    }
  }

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
      const outputData = output as { tasks?: { id: string; title: string }[] };
      const updatedTasks = outputData?.tasks || [];
      return (
        <div className="flex flex-col gap-2 my-2 animate-in fade-in slide-in-from-top-1 duration-300 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-100/50 dark:border-blue-500/20 w-fit max-w-full">
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
            <div className="text-[11px] text-muted-foreground px-1 max-w-full break-words">
              {errorText}
            </div>
          )}
        </div>
      );
    }
  }

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
      const outputData = output as { deletedIds?: string[] };
      const deletedIds = outputData?.deletedIds || [];
      return (
        <div className="flex flex-col gap-2 my-2 animate-in fade-in slide-in-from-top-1 duration-300 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-destructive font-semibold bg-destructive/5 px-3 py-1 rounded-lg border border-destructive/10 w-fit max-w-full">
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
            <div className="text-[11px] text-muted-foreground px-1 max-w-full break-words">
              {errorText}
            </div>
          )}
        </div>
      );
    }
  }

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
      const outputData = output as { tasks?: { id: string; title: string }[] };
      const tasks = outputData?.tasks || [];
      return (
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground font-medium bg-muted/30 px-3 py-1 rounded-lg border border-muted-foreground/10 w-fit max-w-full my-2">
          <List className="size-3.5" />
          <span>
            Found {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </span>
        </div>
      );
    }
  }

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
      const outputData = output as { tasks?: { id: string; title: string }[] };
      const tasks = outputData?.tasks || [];
      return (
        <div className="flex flex-col gap-1.5 my-2 animate-in fade-in slide-in-from-top-1 duration-300 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground font-medium bg-muted/30 px-3 py-1 rounded-lg border border-muted-foreground/10 w-fit max-w-full">
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

  return (
    <Tool className="my-2" defaultOpen={isError}>
      <ToolHeader
        type={part.type}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        state={(state as any) || 'input-streaming'}
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
  'Create a project roadmap: 5 high-priority tasks for the Q2 launch',
  "Find all 'Marketing' tasks and update their status to COMPLETED",
  'List all pending tasks that were created in the last 7 days',
  "Search for 'Frontend' tasks and set their priority to HIGH",
  'Declutter my workspace: delete all tasks that are already COMPLETED',
];

export function ChatInterface() {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'streaming' | 'submitted'>(
    'idle',
  );
  const { addTasks, updateTasks, removeTasks } = useTaskStore();
  const processedToolInvocationIds = useRef(new Set<string>());
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchMessages();
    const handleClearChat = () => setMessages([]);
    window.addEventListener('clear-chat', handleClearChat);
    return () => window.removeEventListener('clear-chat', handleClearChat);
  }, [fetchMessages]);

  useEffect(() => {
    messages.forEach((message) => {
      const parts = message.parts || [];
      parts.forEach((part) => {
        if (
          part.type.startsWith('tool-') &&
          part.state === 'output-available' &&
          part.toolCallId &&
          !processedToolInvocationIds.current.has(part.toolCallId)
        ) {
          const toolName = part.type.replace('tool-', '');
          const output = part.output;

          const outputData = output as {
            success?: boolean;
            tasks?: Task[];
            deletedIds?: string[];
          };

          if (outputData?.success) {
            if (toolName === 'createTasks' && outputData.tasks) {
              addTasks(outputData.tasks);
            } else if (toolName === 'updateTasks' && outputData.tasks) {
              updateTasks(
                outputData.tasks.map((t: { id: string }) => ({
                  id: t.id,
                  updates: t,
                })),
              );
            } else if (toolName === 'deleteTasks' && outputData.deletedIds) {
              removeTasks(outputData.deletedIds);
            }
          }
          processedToolInvocationIds.current.add(part.toolCallId);
        }
      });
    });
  }, [messages, addTasks, updateTasks, removeTasks]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, status]);

  const sendMessage = async (prompt: string) => {
    if (!prompt.trim()) return;

    const userMessage: UIMessage = {
      id: nanoid(),
      role: 'user',
      content: prompt,
      parts: [{ type: 'text', text: prompt }],
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setStatus('submitted');
    window.dispatchEvent(new CustomEvent('message-sent'));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
            parts: m.parts,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const assistantId = nanoid();
      const assistantMessage: UIMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        parts: [],
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStatus('streaming');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          const code = line[0];
          const content = line.slice(2);

          if (code === '0') {
            const text = JSON.parse(content);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: m.content + text } : m,
              ),
            );
          } else if (code === 'b') {
            const part = JSON.parse(content);
            setMessages((prev) =>
              prev.map((m) => {
                if (m.id !== assistantId) return m;

                const newParts = [...m.parts];
                const lastPart = newParts[newParts.length - 1];

                // Merge consecutive text parts
                if (part.type === 'text' && lastPart?.type === 'text') {
                  newParts[newParts.length - 1] = {
                    ...lastPart,
                    text: (lastPart.text || '') + (part.text || ''),
                  };
                  return { ...m, parts: newParts };
                }

                // Merge consecutive reasoning parts
                if (
                  part.type === 'reasoning' &&
                  lastPart?.type === 'reasoning'
                ) {
                  newParts[newParts.length - 1] = {
                    ...lastPart,
                    reasoning:
                      (lastPart.reasoning || '') + (part.reasoning || ''),
                    isStreaming: part.isStreaming ?? lastPart.isStreaming,
                  };
                  return { ...m, parts: newParts };
                }

                // Update existing tool parts (by toolCallId)
                const existingPartIndex = m.parts.findIndex(
                  (p) =>
                    p.toolCallId &&
                    p.toolCallId === part.toolCallId &&
                    part.toolCallId,
                );

                if (existingPartIndex !== -1 && part.toolCallId) {
                  newParts[existingPartIndex] = {
                    ...newParts[existingPartIndex],
                    ...part,
                  };
                } else {
                  newParts.push(part);
                }

                return { ...m, parts: newParts };
              }),
            );
          } else if (code === '3') {
            const errorMsg = JSON.parse(content);
            throw new Error(errorMsg);
          } else if (code === 'd') {
            // Finish turn and mark reasoning as not streaming (triggering auto-collapse)
            setMessages((prev) =>
              prev.map((m) => {
                if (m.id !== assistantId) return m;
                return {
                  ...m,
                  parts: m.parts.map((p) =>
                    p.type === 'reasoning' ? { ...p, isStreaming: false } : p,
                  ),
                };
              }),
            );
          }
        }
      }

      // Note: Message persistence is now handled on the server side in streamText.ts
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Chat error:', err);
      const isLimitError =
        err.message?.includes('limit') || err.message?.includes('403');
      toast.error(
        isLimitError ? 'Daily Limit Reached' : 'Failed to send message',
        {
          description: isLimitError
            ? 'You have reached your limit of 20 messages per day.'
            : err.message,
        },
      );
    } finally {
      setStatus('idle');
    }
  };

  const handleSubmit = (message: { text: string; files: unknown[] }) => {
    sendMessage(message.text);
  };

  const handleSuggestionClick = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="flex h-full flex-col bg-background relative shadow-inner overflow-hidden">
      <Conversation className="flex-1 overflow-hidden">
        <ConversationContent className="p-3 sm:p-4 md:p-6 space-y-6 min-w-0 overflow-x-hidden">
          {loading ? (
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
            <div className="flex flex-col h-full w-full max-w-2xl mx-auto min-w-0">
              <ConversationEmptyState
                icon={
                  <div className="p-4 rounded-full bg-primary/10 mb-4">
                    <List className="size-10 text-primary/60" />
                  </div>
                }
                title="Task Assistant"
                description="I'm here to help you manage your tasks. Create, update, search or delete tasks."
              />
              <div className="mt-8 space-y-3 px-4">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground tracking-wider mb-2">
                  <Sparkles className="size-3 text-primary/60 shrink-0" />
                  <span className="truncate">Try asking</span>
                </div>
                <div className="grid gap-2">
                  {TASK_SUGGESTIONS.map((suggestion) => (
                    <PromptSuggestion
                      key={suggestion}
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
            messages.map((message) => {
              const parts = message.parts || [];
              return (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    {parts.length > 0 ? (
                      parts.map((part: MessagePart, i: number) => {
                        const key = `${message.id}-${i}`;
                        if (part.type === 'reasoning') {
                          return (
                            <Reasoning
                              key={key}
                              isStreaming={!!part.isStreaming}
                            >
                              <ReasoningTrigger />
                              <ReasoningContent>
                                {part.reasoning ?? part.text ?? ''}
                              </ReasoningContent>
                            </Reasoning>
                          );
                        }
                        if (part.type === 'text' || (!part.type && part.text)) {
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
                        if (
                          part.type?.startsWith('tool-') ||
                          part.type === 'tool-invocation' ||
                          part.type === 'tool-call'
                        ) {
                          return <TaskToolCall key={key} part={part} />;
                        }
                        return null;
                      })
                    ) : (
                      <MessageResponse className="leading-relaxed">
                        {message.content}
                      </MessageResponse>
                    )}
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
        <div className="w-full max-w-2xl mx-auto min-w-0 px-2 sm:px-0">
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
