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
import { MessageSquare } from "lucide-react";
import { useTaskStore } from "@/context";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";

const getToolDisplayName = (toolName: string, args: any, state: string) => {
  const isPending =
    state === "input-streaming" ||
    state === "input-available" ||
    state === "approval-requested";

  switch (toolName) {
    case "createTasks": {
      const count = args?.tasks?.length || (args?.title ? 1 : 0);
      if (count === 0)
        return isPending ? "Preparing tasks..." : "Created tasks";
      const action = isPending ? "Creating" : "Created";
      return `${action} ${count} task${count !== 1 ? "s" : ""}`;
    }
    case "updateTasks": {
      const count = args?.updates?.length || 0;
      const action = isPending ? "Updating" : "Updated";
      return `${action} ${count} task${count !== 1 ? "s" : ""}`;
    }
    case "deleteTasks": {
      const count = args?.ids?.length || 0;
      const action = isPending ? "Deleting" : "Deleted";
      return `${action} ${count} task${count !== 1 ? "s" : ""}`;
    }
    case "getTasks":
      return isPending ? "Fetching tasks..." : "Fetched tasks";
    case "searchTasks":
      return isPending
        ? `Searching tasks for "${args?.query || "..."}"`
        : `Searched tasks for "${args?.query}"`;
    default:
      return toolName;
  }
};

export function ChatInterface() {
  const [input, setInput] = useState("");
  const { addTasks, updateTasks, removeTasks } = useTaskStore();
  const processedToolInvocationIds = useRef(new Set<string>());

  const { messages, sendMessage, status } = useChat();

  // Optimized Sync: Update store as soon as tool results appear in the stream
  useEffect(() => {
    messages.forEach((message: any) => {
      // 1. Check toolInvocations (v3/v4 standard)
      if (message.toolInvocations) {
        message.toolInvocations.forEach((invocation: any) => {
          if (invocation.state === "result") {
            const { toolCallId, toolName, result } = invocation;
            if (
              toolCallId &&
              !processedToolInvocationIds.current.has(toolCallId)
            ) {
              if (result && result.success) {
                if (toolName === "createTasks") {
                  addTasks(result.tasks);
                } else if (toolName === "updateTasks") {
                  updateTasks(
                    result.tasks.map((t: any) => ({ id: t.id, updates: t }))
                  );
                } else if (toolName === "deleteTasks") {
                  removeTasks(result.deletedIds);
                }
                processedToolInvocationIds.current.add(toolCallId);
              }
            }
          }
        });
      }

      // 2. Check parts (v4+ standard, and internal typed parts)
      if (message.parts) {
        message.parts.forEach((part: any) => {
          // Check for various result part types
          if (
            part.type === "tool-result" ||
            part.type === "tool-output-available"
          ) {
            const toolInvocation = part.toolInvocation || part;
            const { toolCallId, toolName, result, output } = toolInvocation;
            const actualResult = result || output;

            if (
              toolCallId &&
              !processedToolInvocationIds.current.has(toolCallId)
            ) {
              if (actualResult && actualResult.success) {
                if (toolName === "createTasks") {
                  addTasks(actualResult.tasks);
                } else if (toolName === "updateTasks") {
                  updateTasks(
                    actualResult.tasks.map((t: any) => ({
                      id: t.id,
                      updates: t,
                    }))
                  );
                } else if (toolName === "deleteTasks") {
                  removeTasks(actualResult.deletedIds);
                }
                processedToolInvocationIds.current.add(toolCallId);
              }
            }
          }
        });
      }
    });
  }, [messages, addTasks, updateTasks, removeTasks]);

  const handleSubmit = (message: { text: string; files: any[] }) => {
    if (message.text.trim()) {
      sendMessage({ text: message.text });
      setInput("");
    }
  };

  return (
    <div className="flex h-full flex-col bg-muted/5 relative">
      <div className="flex-1 overflow-hidden relative">
        <Conversation className="size-full">
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquare className="size-12" />}
                title="Start a conversation"
                description="Type a message below to begin chatting"
              />
            ) : (
              messages.map((message) => (
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {/* Render message text from content (legacy) or parts (modern) */}
                    <MessageResponse>
                      {(message as any).content ||
                        (message as any).parts
                          ?.filter((p: any) => p.type === "text")
                          .map((p: any) => p.text)
                          .join("")}
                    </MessageResponse>

                    {/* Render tool invocations with broad fallback for all tool-related part types */}
                    {(() => {
                      const toolInvocations =
                        (message as any).toolInvocations || [];
                      const toolParts =
                        (message as any).parts?.filter((p: any) =>
                          p.type.startsWith("tool-")
                        ) || [];

                      // Combine and ensure uniqueness by toolCallId if possible
                      const uniqueTools = new Map();
                      toolInvocations.forEach((ti: any) =>
                        uniqueTools.set(ti.toolCallId || ti.id, ti)
                      );
                      toolParts.forEach((tp: any) => {
                        const id =
                          tp.toolCallId ||
                          tp.toolInvocation?.toolCallId ||
                          tp.id;
                        uniqueTools.set(id, tp);
                      });

                      return Array.from(uniqueTools.values()).map(
                        (tool: any, i: number) => {
                          const toolInvocation = tool.toolInvocation || tool;
                          const isResult =
                            toolInvocation.state === "result" ||
                            toolInvocation.type === "tool-result" ||
                            toolInvocation.type === "tool-output-available" ||
                            toolInvocation.type === "tool-output-error" ||
                            !!toolInvocation.result ||
                            !!toolInvocation.output ||
                            !!toolInvocation.error ||
                            !!toolInvocation.errorText;

                          const state =
                            toolInvocation.state ||
                            (toolInvocation.type === "tool-output-error"
                              ? "output-error"
                              : isResult
                              ? "output-available"
                              : "input-available");

                          const args =
                            toolInvocation.args || toolInvocation.input;
                          const result =
                            toolInvocation.result || toolInvocation.output;
                          const error =
                            toolInvocation.error ||
                            toolInvocation.errorText ||
                            result?.error;

                          return (
                            <Tool key={`${message.id}-tool-${i}`} defaultOpen>
                              <ToolHeader
                                state={state as any}
                                title={getToolDisplayName(
                                  toolInvocation.toolName,
                                  isResult ? result : args,
                                  state
                                )}
                                type={
                                  (toolInvocation.type ||
                                    (isResult
                                      ? "tool-result"
                                      : "tool-call")) as any
                                }
                              />
                              <ToolContent>
                                {!isResult || args ? (
                                  <ToolInput input={args} />
                                ) : null}
                                {isResult && (
                                  <ToolOutput
                                    output={result}
                                    errorText={error}
                                  />
                                )}
                              </ToolContent>
                            </Tool>
                          );
                        }
                      );
                    })()}
                  </MessageContent>
                </Message>
              ))
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>

      <div className="p-4 border-t bg-background/50 backdrop-blur supports-backdrop-filter:bg-background/50">
        <PromptInput
          onSubmit={handleSubmit}
          className="w-full max-w-2xl mx-auto relative"
        >
          <PromptInputTextarea
            value={input}
            placeholder="Type a message to create or manage tasks..."
            onChange={(e) => setInput(e.currentTarget.value)}
            className="pr-12"
          />
          <PromptInputSubmit
            status={status === "streaming" ? "streaming" : "ready"}
            disabled={!input.trim()}
            className="absolute bottom-1 right-1"
          />
        </PromptInput>
      </div>
    </div>
  );
}
