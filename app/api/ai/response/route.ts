import { ACTION_PROMPT } from "@/lib/prompts";
import { GoogleGenAI } from "@google/genai";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

interface ConversationMessage {
  sender: "USER" | "AI";
  content: string;
}

interface RequestBody {
  text: string;
  tasks: unknown[];
  conversationHistory?: ConversationMessage[];
}

// Initialize Google GenAI client
const getGenAIClient = () => {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY environment variable is not set");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Generates AI response using Google GenAI
 * @param prompt - The prompt to send to the AI
 * @returns Generated text response
 * @throws Error if API call fails
 */
const generateResponse = async (prompt: string): Promise<string> => {
  try {
    const genai = getGenAIClient();
    const response = await genai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    if (!response?.text) {
      throw new Error("Empty response from AI model");
    }

    return response.text;
  } catch (error) {
    console.error("Error calling Google GenAI:", error);
    if (error instanceof Error) {
      throw new Error(`AI service error: ${error.message}`);
    }
    throw new Error("AI service error: Unknown error");
  }
};

/**
 * Validates request body
 */
function validateRequestBody(body: unknown): body is RequestBody {
  if (!body || typeof body !== "object") {
    return false;
  }

  const reqBody = body as Partial<RequestBody>;

  // Validate text
  if (!reqBody.text || typeof reqBody.text !== "string") {
    return false;
  }

  if (reqBody.text.trim().length === 0) {
    return false;
  }

  if (reqBody.text.length > 10000) {
    return false;
  }

  // Validate tasks
  if (!reqBody.tasks || !Array.isArray(reqBody.tasks)) {
    return false;
  }

  // Validate conversation history if provided
  if (reqBody.conversationHistory !== undefined) {
    if (!Array.isArray(reqBody.conversationHistory)) {
      return false;
    }

    // Validate each message in conversation history
    for (const msg of reqBody.conversationHistory) {
      if (
        !msg ||
        typeof msg !== "object" ||
        !("sender" in msg) ||
        !("content" in msg) ||
        !["USER", "AI"].includes(msg.sender as string) ||
        typeof msg.content !== "string"
      ) {
        return false;
      }
    }

    // Limit conversation history size
    if (reqBody.conversationHistory.length > 50) {
      return false;
    }
  }

  return true;
}

/**
 * Formats conversation history for the prompt
 */
function formatConversationHistory(
  conversationHistory?: ConversationMessage[]
): string {
  if (
    !conversationHistory ||
    !Array.isArray(conversationHistory) ||
    conversationHistory.length === 0
  ) {
    return "";
  }

  // Limit to last 10 messages to avoid prompt size issues
  const recentMessages = conversationHistory.slice(-10);

  return `CONVERSATION HISTORY (Last ${recentMessages.length} messages):
${recentMessages
  .map(
    (msg) =>
      `${msg.sender === "USER" ? "You" : "AI"}: ${msg.content.slice(0, 1000)}`
  )
  .join("\n")}

`;
}

/**
 * POST /api/ai/response
 * Generates AI response for task management
 */
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    let body: unknown;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    if (!validateRequestBody(body)) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details:
            "Request must include: text (string, 1-10000 chars), tasks (array), and optional conversationHistory (array of {sender, content})",
        },
        { status: 400 }
      );
    }

    const { text, tasks, conversationHistory } = body;

    // Sanitize text input
    const sanitizedText = text.trim().slice(0, 10000);

    // Format conversation history
    const conversationSection = formatConversationHistory(conversationHistory);

    // Build prompt
    const prompt = ACTION_PROMPT.replace(
      "{{TASKS}}",
      JSON.stringify(tasks.slice(0, 1000)) // Limit tasks to prevent prompt size issues
    )
      .replace("{{CONVERSATION_HISTORY}}", conversationSection)
      .replace("{{MESSAGE}}", sanitizedText);

    // Generate AI response
    const response = await generateResponse(prompt);

    return NextResponse.json({
      text: response,
    });
  } catch (error) {
    console.error("Error in AI response endpoint:", error);

    // Don't expose internal error details to client
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // Check if it's a known error type
    if (errorMessage.includes("GOOGLE_API_KEY")) {
      return NextResponse.json(
        { error: "AI service configuration error" },
        { status: 500 }
      );
    }

    if (errorMessage.includes("AI service error")) {
      return NextResponse.json(
        { error: "Failed to generate AI response. Please try again." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
