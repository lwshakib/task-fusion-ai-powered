export type ToolUIPart = {
  type: string;
  state:
    | 'input-streaming'
    | 'input-available'
    | 'approval-requested'
    | 'approval-responded'
    | 'output-available'
    | 'output-error'
    | 'output-denied';
  input: Record<string, unknown> | unknown;
  output: Record<string, unknown> | unknown;
  errorText?: string;
};

export type LanguageModelUsage = {
  inputTokens: number;
  outputTokens: number;
  reasoningTokens?: number;
  cachedInputTokens?: number;
};

export type Experimental_GeneratedImage = {
  base64?: string;
  uint8Array?: Uint8Array;
  mediaType: string;
};
