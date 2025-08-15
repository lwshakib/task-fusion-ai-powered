"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useTasks } from "../task-provider";

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      );

      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

const MIN_HEIGHT = 48;
const MAX_HEIGHT = 164;

const AnimatedPlaceholder = () => (
  <AnimatePresence mode="wait">
    <motion.p
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.1 }}
      className="pointer-events-none w-[150px] text-sm absolute text-black/70 dark:text-white/70"
    >
      Ask Task Fusion AI...
    </motion.p>
  </AnimatePresence>
);

export default function AiInput() {
  const [value, setValue] = useState("");
  const { handleAiInput } = useTasks();
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
  });

  const handleSubmit = () => {
    if (value.trim()) {
      handleAiInput(value.trim());
      setValue("");
      adjustHeight(true);
    }
  };
  return (
    <div className="w-full py-4">
      <div className="relative max-w-xl border rounded-[22px] border-black/5 p-1 w-full mx-auto">
        <div className="relative rounded-2xl border border-black/5 bg-neutral-800/5 flex flex-col">
          <div
            className="overflow-y-auto"
            style={{ maxHeight: `${MAX_HEIGHT}px` }}
          >
            <div className="relative">
              <Textarea
                id="ai-input-04"
                value={value}
                placeholder=""
                className="w-full rounded-2xl rounded-b-none px-4 py-3 bg-black/5 dark:bg-white/5 border-none dark:text-white resize-none focus-visible:ring-0 leading-[1.2]"
                ref={textareaRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                onChange={(e) => {
                  setValue(e.target.value);
                  adjustHeight();
                }}
              />
              {!value && (
                <div className="absolute left-4 top-3">
                  <AnimatedPlaceholder />
                </div>
              )}
            </div>
          </div>

          <div className="h-12 bg-black/5 dark:bg-white/5 rounded-b-xl flex items-center justify-end px-3">
            <button
              type="button"
              onClick={handleSubmit}
              className={cn(
                "rounded-full p-2 transition-colors",
                value
                  ? "bg-[#ff3f17]/15 text-[#ff3f17]"
                  : "bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
