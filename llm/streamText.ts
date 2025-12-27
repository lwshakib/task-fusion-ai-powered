import {
  streamText as _streamText,
  convertToModelMessages,
  stepCountIs,
} from "ai";
import { SYSTEM_PROMPT } from "./prompts";
import { GeminiModel } from "./model";
import { getAllTools } from "./tools";

interface ToolResult<Name extends string, Args, Result> {
  toolCallId: string;
  toolName: Name;
  args: Args;
  result: Result;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  toolInvocations?: ToolResult<string, unknown, unknown>[];
}

export type Messages = Message[];

export async function streamText(messages: Messages, userId: string) {
  return _streamText({
    model: GeminiModel(),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages as any),
    maxOutputTokens: 65535,
    toolChoice: "auto",
    stopWhen: stepCountIs(5),
    tools: getAllTools(userId),
  });
}
