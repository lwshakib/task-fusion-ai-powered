import { ai } from './client';
import { CHAT_MODEL_ID } from './constants';
import { SYSTEM_PROMPT } from './prompts';
import { toolDefinitions, toolHandlers } from './tools';
import prisma from '@/lib/prisma';
import { MESSAGE_ROLE } from '@/generated/prisma/enums';
import type { Prisma } from '@/generated/prisma/client';

/**
 * Functional streamText implementation using @google/genai.
 * Handles multi-turn chat, tool execution, and real-time streaming.
 */
export async function streamText(
  messages: { role: string; content: string; name?: string; parts?: Record<string, unknown>[] }[],
  userId: string,
  signal?: AbortSignal,
) {
  const handlers = toolHandlers(userId);
  const encoder = new TextEncoder();

  // 1. Prepare chat history
  const history: { role: 'user' | 'model'; parts: { text?: string; functionCall?: Record<string, unknown>; functionResponse?: Record<string, unknown> }[] }[] = [];
  for (let i = 0; i < messages.length - 1; i++) {
    const m = messages[i];
    if (m.role === 'system') continue;

    const role = m.role === 'assistant' || m.role === 'model' ? 'model' : 'user';
    const geminiParts: { text?: string; functionCall?: Record<string, unknown>; functionResponse?: Record<string, unknown> }[] = [];

    const dbParts = (m.parts as Record<string, unknown>[]) || [];
    
    // If we have parts, map them. Otherwise fallback to content.
    if (dbParts.length > 0) {
      for (const p of dbParts) {
        if (p.type === 'text' && p.text) {
          geminiParts.push({ text: p.text as string });
        } else if (p.type === 'reasoning' && p.reasoning) {
          // Map reasoning to text for now so the model sees it
          geminiParts.push({ text: `[Thought: ${p.reasoning}]` });
        } else if (typeof p.type === 'string' && p.type.startsWith('tool-')) {
          const toolName = p.type.replace('tool-', '');
          
          if (p.output !== undefined) {
            // This was a tool response
            geminiParts.push({
              functionResponse: {
                name: toolName,
                response: { content: p.output },
              },
            });
          } else if (p.input !== undefined) {
            // This was a tool call
            geminiParts.push({
              functionCall: {
                name: toolName,
                args: p.input,
              },
            });
          }
        }
      }
    }

    // Fallback if no parts were mapped but content exists
    if (geminiParts.length === 0 && m.content) {
      geminiParts.push({ text: m.content });
    }

    // Crucial: Every turn in Gemini history MUST have at least one part.
    if (geminiParts.length === 0) {
      geminiParts.push({ text: ' ' }); // Minimal valid part
    }

    history.push({ role, parts: geminiParts });
  }

  // 2. Initialize chat session
  const chat = ai.chats.create({
    model: CHAT_MODEL_ID,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      tools: [{ functionDeclarations: toolDefinitions }],
    },
    history: history,
  });

  const lastMessage = messages[messages.length - 1];
  let lastText = lastMessage.content || '';
  if (Array.isArray(lastMessage.parts)) {
    const textParts = (lastMessage.parts as Record<string, unknown>[]).map((p) => (p.text as string) || '');
    lastText = textParts.join('').trim();
  }
  
  // Ensure lastText is never empty to avoid 'ContentUnion is required' error
  if (!lastText) {
    lastText = ' ';
  }

  const stream = new ReadableStream({
    async start(controller) {
      let iteration = 0;
      const maxIterations = 5;
      const assistantParts: Array<Record<string, unknown>> = [];
      let currentInput: string | Array<Record<string, unknown>> = lastText;

      try {
        while (iteration < maxIterations) {
          if (signal?.aborted) {
            controller.close();
            return;
          }
          iteration++;

          const responseStream = await chat.sendMessageStream({ message: currentInput as string | Array<Record<string, unknown>> });
          const turnToolCalls: Array<{ id: string; name: string; args: Record<string, unknown> }> = [];

          for await (const chunk of responseStream) {
            if (signal?.aborted) {
              controller.close();
              return;
            }
            const candidate = chunk.candidates?.[0];
            if (!candidate) continue;

            const parts = candidate.content?.parts || [];
            for (const part of parts) {
              if (part.text) {
                controller.enqueue(encoder.encode(`0:${JSON.stringify(part.text)}\n`));
                const textPart = { type: 'text', text: part.text };
                controller.enqueue(encoder.encode(`b:${JSON.stringify(textPart)}\n`));

                const lastPart = assistantParts[assistantParts.length - 1];
                if (lastPart?.type === 'text') {
                  lastPart.text = `${lastPart.text ?? ''}${part.text}`;
                } else {
                  assistantParts.push({ ...textPart });
                }
              }

              if (part.functionCall && part.functionCall.name) {
                turnToolCalls.push({
                  id: `call_${Math.random().toString(36).substring(2, 11)}`,
                  name: part.functionCall.name,
                  args: part.functionCall.args as Record<string, unknown>,
                });
              }
            }
          }

          if (turnToolCalls.length > 0) {
            const toolResponses: Array<Record<string, unknown>> = [];
            for (const call of turnToolCalls) {
              if (signal?.aborted) {
                controller.close();
                return;
              }
              const toolName = call.name;
              const args = call.args;

              const callPart = {
                type: `tool-${toolName}`,
                state: 'input-available',
                input: args,
                toolCallId: call.id,
              };
              controller.enqueue(encoder.encode(`b:${JSON.stringify(callPart)}\n`));
              assistantParts.push({ ...callPart });

              const handler = (handlers as Record<string, (args: Record<string, unknown>) => Promise<unknown>>)[toolName];
              if (!handler) continue;

              try {
                const result = await handler(args);
                const resultPart = {
                  type: `tool-${toolName}`,
                  state: 'output-available',
                  output: result,
                  toolCallId: call.id,
                };
                controller.enqueue(encoder.encode(`b:${JSON.stringify(resultPart)}\n`));

                const partIdx = assistantParts.findIndex((p) => p.toolCallId === call.id);
                if (partIdx !== -1) {
                  assistantParts[partIdx] = { ...assistantParts[partIdx], ...resultPart };
                }

                toolResponses.push({
                  functionResponse: {
                    name: toolName,
                    response: { content: result },
                  },
                });
              } catch (e: unknown) {
                console.error(`AI tool execution failed [${toolName}]:`, e);
                const errorPart = {
                  type: `tool-${toolName}`,
                  state: 'output-error',
                  errorText: 'AI agent failed to execute this action.',
                  toolCallId: call.id,
                };
                controller.enqueue(encoder.encode(`b:${JSON.stringify(errorPart)}\n`));

                const partIdx = assistantParts.findIndex((p) => p.toolCallId === call.id);
                if (partIdx !== -1) {
                  assistantParts[partIdx] = { ...assistantParts[partIdx], ...errorPart };
                }

                toolResponses.push({
                  functionResponse: {
                    name: toolName,
                    response: {
                      content: { success: false, error: 'AI tool execution failed.' },
                    },
                  },
                });
              }
            }
            currentInput = toolResponses;
          } else {
            break;
          }
        }

        // 3. Finalize and persist assistant response
        if (assistantParts.length > 0) {
          try {
            await prisma.message.create({
              data: {
                userId,
                role: MESSAGE_ROLE.assistant,
                parts: assistantParts as Prisma.InputJsonValue[],
              },
            });
          } catch (dbErr) {
            console.error('Failed to persist assistant message:', dbErr);
          }
        }

        controller.enqueue(
          encoder.encode(`d:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n`),
        );
        controller.close();
      } catch (err: unknown) {
        console.error('AI stream execution failed:', err);
        controller.enqueue(encoder.encode(`3:${JSON.stringify('Internal server error. AI execution failed.')}\n`));
        controller.close();
      }
    },
  });

  return {
    toUIMessageStreamResponse: (options?: Record<string, unknown>) => {
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
