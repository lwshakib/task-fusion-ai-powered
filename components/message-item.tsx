import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Card } from "./ui/card";

interface Message {
  id: string;
  content: string;
  sender: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const isUser = message.sender === "USER";

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <Card
        className={cn(
          "max-w-[80%] p-3",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium opacity-70">
            {isUser ? "You" : "AI"}
          </div>
          <div className="text-sm leading-relaxed">{message.content}</div>
          <div className="text-xs opacity-50 mt-1">
            {formatDistanceToNow(message.createdAt, { addSuffix: true })}
          </div>
        </div>
      </Card>
    </div>
  );
}
