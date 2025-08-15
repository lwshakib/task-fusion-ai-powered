import { ACTION_PROMPT } from "@/lib/prompts";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const genai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY as string });

const generateResponse = async (prompt: string) => {
  const response = await genai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });
  return response?.text;
};

export async function POST(req: NextRequest) {
  const { text, tasks, conversationHistory } = await req.json();

  if (!tasks || !Array.isArray(tasks)) {
    console.error("Invalid tasks data received:", tasks);
    return NextResponse.json({ error: "Invalid tasks data" }, { status: 400 });
  }

  if (!text || typeof text !== "string") {
    console.error("Invalid text data received:", text);
    return NextResponse.json({ error: "Invalid text data" }, { status: 400 });
  }

  // Format conversation history for the prompt
  let conversationSection = "";
  if (
    conversationHistory &&
    Array.isArray(conversationHistory) &&
    conversationHistory.length > 0
  ) {
    conversationSection = `CONVERSATION HISTORY (Last ${
      conversationHistory.length
    } messages):
${conversationHistory
  .map((msg: any) => `${msg.sender === "USER" ? "You" : "AI"}: ${msg.content}`)
  .join("\n")}

`;
  }

  const prompt = ACTION_PROMPT.replace("{{TASKS}}", JSON.stringify(tasks))
    .replace("{{CONVERSATION_HISTORY}}", conversationSection)
    .replace("{{MESSAGE}}", text);

  try {
    const response = await generateResponse(prompt);

    return NextResponse.json({
      text: response,
    });
  } catch (error) {
    console.error("Error generating AI response:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response" },
      { status: 500 }
    );
  }
}
