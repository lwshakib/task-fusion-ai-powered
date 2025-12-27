import {
  streamText as _streamText,
  convertToModelMessages,
  stepCountIs,
  StreamTextOnFinishCallback,
  Tool,
} from "ai";
import { SYSTEM_PROMPT } from "./prompts";
import { GeminiModel } from "./model";


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

export type StreamingOptions = Omit<Parameters<typeof _streamText>[0], "model">;

export interface StreamTextOptions {
  onFinish?: StreamTextOnFinishCallback<Record<string, Tool>>;
}

export async function  streamText(messages: Messages, options?: StreamTextOptions) {
  const { onFinish } = options || {};

  return _streamText({
    model: GeminiModel(),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages as any),
    maxOutputTokens: 65535,
    onFinish,
  });
}
