import { useEffect, useRef } from "react";
import MessageItem from "./message-item";
import { useTasks } from "./task-provider";
import { ScrollArea } from "./ui/scroll-area";

export default function MessageView() {
  const { messages, messagesLoading } = useTasks();
  const viewportRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);

  if (messagesLoading) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="px-4 space-y-2">
          {/* AI Message Skeleton */}
          <div className="flex w-full mb-4 justify-start">
            <div className="max-w-[80%] p-3 bg-muted rounded-lg animate-pulse">
              <div className="flex flex-col gap-1">
                <div className="h-4 w-8 bg-muted-foreground/20 rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted-foreground/20 rounded w-full"></div>
                  <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
                  <div className="h-4 bg-muted-foreground/20 rounded w-1/2"></div>
                </div>
                <div className="h-3 w-16 bg-muted-foreground/20 rounded mt-1"></div>
              </div>
            </div>
          </div>

          {/* User Message Skeleton */}
          <div className="flex w-full mb-4 justify-end">
            <div className="max-w-[80%] p-3 bg-primary/20 rounded-lg animate-pulse">
              <div className="flex flex-col gap-1">
                <div className="h-4 w-12 bg-primary/30 rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-primary/30 rounded w-2/3"></div>
                  <div className="h-4 bg-primary/30 rounded w-1/2"></div>
                </div>
                <div className="h-3 w-20 bg-primary/30 rounded mt-1"></div>
              </div>
            </div>
          </div>

          {/* AI Message Skeleton */}
          <div className="flex w-full mb-4 justify-start">
            <div className="max-w-[80%] p-3 bg-muted rounded-lg animate-pulse">
              <div className="flex flex-col gap-1">
                <div className="h-4 w-8 bg-muted-foreground/20 rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted-foreground/20 rounded w-full"></div>
                  <div className="h-4 bg-muted-foreground/20 rounded w-4/5"></div>
                </div>
                <div className="h-3 w-12 bg-muted-foreground/20 rounded mt-1"></div>
              </div>
            </div>
          </div>

          {/* User Message Skeleton */}
          <div className="flex w-full mb-4 justify-end">
            <div className="max-w-[80%] p-3 bg-primary/20 rounded-lg animate-pulse">
              <div className="flex flex-col gap-1">
                <div className="h-4 w-12 bg-primary/30 rounded"></div>
                <div className="h-4 bg-primary/30 rounded w-1/3"></div>
                <div className="h-3 w-16 bg-primary/30 rounded mt-1"></div>
              </div>
            </div>
          </div>

          {/* AI Message Skeleton */}
          <div className="flex w-full mb-4 justify-start">
            <div className="max-w-[80%] p-3 bg-muted rounded-lg animate-pulse">
              <div className="flex flex-col gap-1">
                <div className="h-4 w-8 bg-muted-foreground/20 rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted-foreground/20 rounded w-full"></div>
                  <div className="h-4 bg-muted-foreground/20 rounded w-2/3"></div>
                  <div className="h-4 bg-muted-foreground/20 rounded w-1/2"></div>
                  <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
                </div>
                <div className="h-3 w-14 bg-muted-foreground/20 rounded mt-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <ScrollArea className="flex-1 min-h-0" viewportRef={viewportRef}>
        <div className="px-4 space-y-2">
          {messages && messages.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <div className="text-center">
                <p className="text-sm">No messages yet</p>
                <p className="text-xs">
                  Start a conversation with the AI assistant
                </p>
              </div>
            </div>
          ) : (
            messages && messages.length > 0 && messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
