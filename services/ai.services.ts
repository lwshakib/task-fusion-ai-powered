import prisma from '@/lib/prisma';
import {
  MESSAGE_ROLE,
  TASK_PRIORITY,
  TASK_STATUS,
} from '@/generated/prisma/enums';
import type { Prisma } from '@/generated/prisma/client';
import { CHAT_MODEL_ID } from '@/lib/constants';

interface Message {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string | null;
  tool_call_id?: string;
  tool_calls?: unknown[];
  name?: string;
}

type TaskInput = {
  title: string;
  description?: string;
  status: TASK_STATUS;
  priority: TASK_PRIORITY;
};

type ToolDefinition = {
  description: string;
  parameters: Record<string, unknown>;
  execute: (args: unknown) => Promise<unknown>;
};

type ToolMap = Record<string, ToolDefinition>;

const SYSTEM_PROMPT = `
You are Task Fusion AI, a powerful task management assistant.
Your goal is to help users manage their tasks efficiently using the provided tools.

### Core Tools:
- **createTasks**: Create one or multiple new tasks.
- **updateTasks**: Update existing tasks by their IDs.
- **deleteTasks**: Delete existing tasks by their IDs.
- **getTasks**: Fetch all current tasks for the user.
- **searchTasks**: Find tasks matching a specific query string.

### Guidelines:
1. Always fetch task IDs with getTasks/searchTasks before update/delete when IDs are missing.
2. Use concise confirmations after completing actions.
3. For createTasks, provide { "tasks": [ ... ] } whenever possible.
4. Valid enums:
   - Status: TODO, COMPLETED.
   - Priority: LOW, MEDIUM, HIGH.
5. Batch operations when user intent includes multiple task actions.
6. Be concise, professional, and action-oriented.
`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toTask(input: unknown): TaskInput {
  if (
    !isRecord(input) ||
    typeof input.title !== 'string' ||
    !input.title.trim()
  ) {
    throw new Error("Each task must include a non-empty 'title'.");
  }

  const task: TaskInput = {
    title: input.title.trim(),
    description:
      typeof input.description === 'string' ? input.description : undefined,
    status:
      input.status === TASK_STATUS.TODO ||
      input.status === TASK_STATUS.COMPLETED
        ? input.status
        : TASK_STATUS.TODO,
    priority:
      input.priority === TASK_PRIORITY.LOW ||
      input.priority === TASK_PRIORITY.MEDIUM ||
      input.priority === TASK_PRIORITY.HIGH
        ? input.priority
        : TASK_PRIORITY.MEDIUM,
  };

  return task;
}

export class AIService {
  private readonly cloudflareGatewayApiKey: string;
  private readonly cloudflareGatewayEndpoint: string;

  constructor() {
    const apiKey = process.env.CLOUDFLARE_AI_GATEWAY_API_KEY;
    const endpoint = process.env.CLOUDFLARE_AI_GATEWAY_ENDPOINT;

    if (!apiKey) {
      throw new Error(
        'Missing CLOUDFLARE_AI_GATEWAY_API_KEY environment variable.',
      );
    }
    if (!endpoint) {
      throw new Error(
        'Missing CLOUDFLARE_AI_GATEWAY_ENDPOINT environment variable.',
      );
    }

    this.cloudflareGatewayApiKey = apiKey;
    this.cloudflareGatewayEndpoint = endpoint;
  }

  private getTools(userId: string): ToolMap {
    return {
      createTasks: {
        description: 'Create one or multiple new tasks.',
        parameters: {
          type: 'object',
          properties: {
            tasks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  status: {
                    type: 'string',
                    enum: [TASK_STATUS.TODO, TASK_STATUS.COMPLETED],
                  },
                  priority: {
                    type: 'string',
                    enum: [
                      TASK_PRIORITY.LOW,
                      TASK_PRIORITY.MEDIUM,
                      TASK_PRIORITY.HIGH,
                    ],
                  },
                },
                required: ['title'],
                additionalProperties: false,
              },
            },
          },
          required: ['tasks'],
          additionalProperties: false,
        },
        execute: async (args: unknown) => {
          let tasksInput: unknown[] | null = null;
          if (isRecord(args) && Array.isArray(args.tasks)) {
            tasksInput = args.tasks;
          } else if (Array.isArray(args)) {
            tasksInput = args;
          } else if (isRecord(args) && typeof args.title === 'string') {
            tasksInput = [args];
          }

          if (!tasksInput) {
            return {
              success: false,
              error: "Invalid input: 'tasks' array is required.",
            };
          }

          const createdTasks = await Promise.all(
            tasksInput.map(async (item) => {
              const task = toTask(item);
              return prisma.task.create({
                data: {
                  ...task,
                  userId,
                },
              });
            }),
          );
          return { success: true, tasks: createdTasks };
        },
      },
      updateTasks: {
        description: 'Update existing tasks by their IDs.',
        parameters: {
          type: 'object',
          properties: {
            updates: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  updates: {
                    type: 'object',
                    properties: {
                      title: { type: 'string' },
                      description: { type: 'string' },
                      status: {
                        type: 'string',
                        enum: [TASK_STATUS.TODO, TASK_STATUS.COMPLETED],
                      },
                      priority: {
                        type: 'string',
                        enum: [
                          TASK_PRIORITY.LOW,
                          TASK_PRIORITY.MEDIUM,
                          TASK_PRIORITY.HIGH,
                        ],
                      },
                    },
                    additionalProperties: false,
                  },
                },
                required: ['id'],
                additionalProperties: false,
              },
            },
          },
          required: ['updates'],
          additionalProperties: false,
        },
        execute: async (args: unknown) => {
          let updates: unknown[] | null = null;
          if (isRecord(args) && Array.isArray(args.updates)) {
            updates = args.updates;
          } else if (isRecord(args) && Array.isArray(args.tasks)) {
            updates = args.tasks;
          } else if (Array.isArray(args)) {
            updates = args;
          } else if (isRecord(args) && typeof args.id === 'string') {
            updates = [args];
          }

          if (!updates) {
            return {
              success: false,
              error:
                "Invalid input: 'updates' array is required with task IDs.",
            };
          }

          const updatedTasks = await Promise.all(
            updates.map(async (item) => {
              if (!isRecord(item) || typeof item.id !== 'string') {
                throw new Error("Each update item must include an 'id'.");
              }

              const source = isRecord(item.updates) ? item.updates : item;
              const payload: Record<string, unknown> = {};

              if (typeof source.title === 'string')
                payload.title = source.title;
              if (typeof source.description === 'string') {
                payload.description = source.description;
              }
              if (
                source.status === TASK_STATUS.TODO ||
                source.status === TASK_STATUS.COMPLETED
              ) {
                payload.status = source.status;
              }
              if (
                source.priority === TASK_PRIORITY.LOW ||
                source.priority === TASK_PRIORITY.MEDIUM ||
                source.priority === TASK_PRIORITY.HIGH
              ) {
                payload.priority = source.priority;
              }

              return prisma.task.update({
                where: { id: item.id, userId },
                data: payload,
              });
            }),
          );

          return { success: true, tasks: updatedTasks };
        },
      },
      deleteTasks: {
        description: 'Delete existing tasks by their IDs.',
        parameters: {
          type: 'object',
          properties: {
            ids: {
              type: 'array',
              items: { type: 'string' },
            },
          },
          required: ['ids'],
          additionalProperties: false,
        },
        execute: async (args: unknown) => {
          let ids: unknown = null;
          if (isRecord(args)) {
            ids = args.ids ?? args.id ?? args.task_ids;
          } else if (Array.isArray(args)) {
            ids = args;
          }

          if (typeof ids === 'string') {
            ids = [ids];
          }

          if (!Array.isArray(ids) || ids.some((id) => typeof id !== 'string')) {
            return {
              success: false,
              error: "Invalid input: 'ids' array is required.",
            };
          }

          await prisma.task.deleteMany({
            where: {
              id: { in: ids as string[] },
              userId,
            },
          });

          return { success: true, deletedIds: ids };
        },
      },
      getTasks: {
        description: 'Fetch all tasks for the current user.',
        parameters: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
        execute: async () => {
          const tasks = await prisma.task.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
          });
          return { success: true, tasks };
        },
      },
      searchTasks: {
        description: 'Search for tasks by title or description query.',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string' },
          },
          required: ['query'],
          additionalProperties: false,
        },
        execute: async (args: unknown) => {
          const query =
            isRecord(args) && typeof args.query === 'string' ? args.query : '';
          if (!query.trim()) {
            return {
              success: false,
              error: "Invalid input: 'query' is required.",
            };
          }

          const tasks = await prisma.task.findMany({
            where: {
              userId,
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
              ],
            },
            orderBy: { createdAt: 'desc' },
          });
          return { success: true, tasks };
        },
      },
    };
  }

  async streamText(
    messages: { role: string; content: string; parts?: unknown[] }[],
    userId: string,
  ) {
    const tools = this.getTools(userId);
    const formattedTools = Object.entries(tools).map(([name, tool]) => ({
      type: 'function',
      function: {
        name,
        description: tool.description,
        parameters: tool.parameters,
      },
    }));

    const chatMessages: Message[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m) => {
        let content = m.content;
        if (Array.isArray(m.parts)) {
          content = m.parts
            .map((p) => {
              const part = p as { text?: string; reasoning?: string };
              return part.text || part.reasoning || '';
            })
            .join('');
        } else if (typeof m.content === 'object' && m.content !== null) {
          content = JSON.stringify(m.content);
        }

        const msg = m as {
          role: string;
          content: string;
          parts?: unknown[];
          tool_calls?: unknown[];
          tool_call_id?: string;
          name?: string;
        };

        return {
          role: msg.role as Message['role'],
          content: content || '',
          tool_calls: msg.tool_calls,
          tool_call_id: msg.tool_call_id,
          name: msg.name,
        };
      }),
    ];

    const encoder = new TextEncoder();

    const gatewayEndpoint = this.cloudflareGatewayEndpoint;
    const gatewayApiKey = this.cloudflareGatewayApiKey;

    const stream = new ReadableStream({
      async start(controller) {
        const currentMessages: Message[] = [...chatMessages];
        let iteration = 0;
        const maxIterations = 5;
        const assistantParts: Array<Record<string, unknown>> = [];

        try {
          while (iteration < maxIterations) {
            iteration++;

            const response = await fetch(gatewayEndpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${gatewayApiKey}`,
              },
              body: JSON.stringify({
                model: CHAT_MODEL_ID,
                messages: currentMessages,
                tools: formattedTools,
                tool_choice: 'auto',
                stream: true,
              }),
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error('AI gateway request failed:', errorText);
              controller.enqueue(
                encoder.encode(
                  `3:${JSON.stringify('AI execution failed. Please try again.')}\n`,
                ),
              );
              controller.close();
              return;
            }

            const reader = response.body!.getReader();
            const decoder = new TextDecoder();
            let fullTurnContent = '';
            let turnToolCalls: Array<{
              id: string;
              type: string;
              function: { name: string; arguments: string };
            }> = [];
            const tcArgsBuffer: string[] = [];
            let lineBuffer = '';
            let turnHadReasoning = false;

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value, { stream: true });
              lineBuffer += chunk;
              const lines = lineBuffer.split('\n');
              lineBuffer = lines.pop() || '';

              for (const line of lines) {
                const trimmedLine = line.trim();
                if (
                  trimmedLine.startsWith('data: ') &&
                  trimmedLine !== 'data: [DONE]'
                ) {
                  try {
                    const data = JSON.parse(trimmedLine.slice(6));
                    const delta = data.choices?.[0]?.delta;
                    if (!delta) continue;

                    const reasoning =
                      delta.reasoning_content ||
                      delta.thought ||
                      delta.thinking;
                    if (reasoning) {
                      turnHadReasoning = true;
                      const reasoningPart = {
                        type: 'reasoning',
                        reasoning: reasoning,
                        isStreaming: true,
                      };
                      controller.enqueue(
                        encoder.encode(`b:${JSON.stringify(reasoningPart)}\n`),
                      );

                      const lastPart =
                        assistantParts[assistantParts.length - 1];
                      if (lastPart?.type === 'reasoning') {
                        lastPart.reasoning = `${lastPart.reasoning ?? ''}${reasoning}`;
                      } else {
                        assistantParts.push({
                          ...reasoningPart,
                          isStreaming: false,
                        });
                      }
                    }

                    if (delta.content) {
                      if (turnHadReasoning) {
                        turnHadReasoning = false;
                        controller.enqueue(
                          encoder.encode(
                            `b:${JSON.stringify({ type: 'reasoning', isStreaming: false })}\n`,
                          ),
                        );
                      }

                      fullTurnContent += delta.content;
                      controller.enqueue(
                        encoder.encode(`0:${JSON.stringify(delta.content)}\n`),
                      );

                      const textPart = { type: 'text', text: delta.content };
                      controller.enqueue(
                        encoder.encode(`b:${JSON.stringify(textPart)}\n`),
                      );

                      const lastPart =
                        assistantParts[assistantParts.length - 1];
                      if (lastPart?.type === 'text') {
                        lastPart.text = `${lastPart.text ?? ''}${delta.content}`;
                      } else {
                        assistantParts.push({ ...textPart });
                      }
                    }

                    if (delta.tool_calls) {
                      if (turnHadReasoning) {
                        turnHadReasoning = false;
                        controller.enqueue(
                          encoder.encode(
                            `b:${JSON.stringify({ type: 'reasoning', isStreaming: false })}\n`,
                          ),
                        );
                      }

                      for (const tc of delta.tool_calls) {
                        const idx = tc.index;
                        if (!turnToolCalls[idx]) {
                          turnToolCalls[idx] = {
                            id: tc.id,
                            type: 'function',
                            function: {
                              name: tc.function?.name,
                              arguments: '',
                            },
                          };
                          tcArgsBuffer[idx] = '';
                        }
                        if (tc.function?.arguments) {
                          tcArgsBuffer[idx] += tc.function.arguments;
                        }
                      }
                    }
                  } catch (e) {
                    console.error('Error parsing SSE line:', trimmedLine, e);
                  }
                }
              }
            }

            if (turnHadReasoning) {
              controller.enqueue(
                encoder.encode(
                  `b:${JSON.stringify({ type: 'reasoning', isStreaming: false })}\n`,
                ),
              );
            }

            turnToolCalls = turnToolCalls.filter(Boolean).map((tc, idx) => ({
              ...tc,
              function: { ...tc.function, arguments: tcArgsBuffer[idx] },
            }));

            currentMessages.push({
              role: 'assistant',
              content: fullTurnContent || null,
              tool_calls: turnToolCalls.length > 0 ? turnToolCalls : undefined,
            });

            if (turnToolCalls.length > 0) {
              for (const tc of turnToolCalls) {
                const toolName = tc.function.name;
                let args: unknown = {};

                try {
                  args = JSON.parse(tc.function.arguments);
                } catch {
                  console.error(
                    'Failed to parse tool args:',
                    tc.function.arguments,
                  );
                }

                const callPart = {
                  type: `tool-${toolName}`,
                  state: 'input-available',
                  input: args,
                  toolCallId: tc.id,
                };
                controller.enqueue(
                  encoder.encode(`b:${JSON.stringify(callPart)}\n`),
                );
                assistantParts.push({ ...callPart });

                const tool = tools[toolName];
                if (!tool) continue;

                try {
                  const result = await tool.execute(args);
                  const resultPart = {
                    type: `tool-${toolName}`,
                    state: 'output-available',
                    output: result,
                    toolCallId: tc.id,
                  };
                  controller.enqueue(
                    encoder.encode(`b:${JSON.stringify(resultPart)}\n`),
                  );

                  const partIdx = assistantParts.findIndex(
                    (p) => p.toolCallId === tc.id,
                  );
                  if (partIdx !== -1) {
                    assistantParts[partIdx] = {
                      ...assistantParts[partIdx],
                      ...resultPart,
                    };
                  }

                  currentMessages.push({
                    role: 'tool',
                    tool_call_id: tc.id,
                    name: toolName,
                    content: JSON.stringify(result),
                  });
                } catch (e: unknown) {
                  const err = e as Error;
                  const errorPart = {
                    type: `tool-${toolName}`,
                    state: 'output-error',
                    errorText: 'AI agent failed to execute this action.',
                    toolCallId: tc.id,
                  };
                  console.error(`Tool execution failed (${toolName}):`, err);
                  controller.enqueue(
                    encoder.encode(`b:${JSON.stringify(errorPart)}\n`),
                  );

                  const partIdx = assistantParts.findIndex(
                    (p) => p.toolCallId === tc.id,
                  );
                  if (partIdx !== -1) {
                    assistantParts[partIdx] = {
                      ...assistantParts[partIdx],
                      ...errorPart,
                    };
                  }

                  currentMessages.push({
                    role: 'tool',
                    tool_call_id: tc.id,
                    name: toolName,
                    content: JSON.stringify({
                      success: false,
                      error: 'AI tool execution failed.',
                    }),
                  });
                }
              }
            } else {
              if (assistantParts.length > 0) {
                try {
                  await prisma.message.create({
                    data: {
                      userId: userId,
                      role: MESSAGE_ROLE.assistant,
                      parts: assistantParts as Prisma.InputJsonValue[],
                    },
                  });
                } catch (dbErr) {
                  console.error('Failed to persist assistant message:', dbErr);
                }
              }

              controller.enqueue(
                encoder.encode(
                  `d:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n`,
                ),
              );
              controller.close();
              return;
            }
          }
        } catch (err: unknown) {
          const error = err as Error;
          console.error('AI stream execution failed:', error);
          controller.enqueue(
            encoder.encode(
              `3:${JSON.stringify('Internal server error. AI execution failed.')}\n`,
            ),
          );
          controller.close();
        }
      },
    });

    return {
      toUIMessageStreamResponse: (options?: unknown) => {
        void options;
        return new Response(stream, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'x-vercel-ai-data-stream': 'v1',
          },
        });
      },
    };
  }
}

export const aiService = new AIService();
