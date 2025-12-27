"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export function ClearMessagesButton() {
  const [isClearing, setIsClearing] = useState(false);

  const handleClear = async () => {
    if (!confirm("Are you sure you want to clear all messages?")) return;

    setIsClearing(true);
    try {
      const response = await fetch("/api/message", {
        method: "DELETE",
      });

      if (response.ok) {
        // Dispatch custom event to notify ChatInterface
        window.dispatchEvent(new CustomEvent("clear-chat"));
        toast.success("Chat history cleared");
      } else {
        throw new Error("Failed to clear chat history");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to clear chat history");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClear}
      disabled={isClearing}
      className="text-muted-foreground hover:text-destructive transition-colors h-8 px-2"
    >
      <Trash2 className="size-4 mr-2" />
      <span className="hidden sm:inline">Clear Chat</span>
    </Button>
  );
}
