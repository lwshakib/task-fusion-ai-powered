"use server";
import { prisma } from "@/lib/prisma";
import { checkUser } from "./user";

type MessageSender = "USER" | "AI";

/**
 * Creates a new message in the database
 * @param sender - Message sender ("USER" or "AI")
 * @param text - Message content
 * @returns Created message or null if user not authenticated
 * @throws Error if validation fails or database operation fails
 */
export const createMessage = async (
  sender: MessageSender,
  text: string
) => {
  try {
    // Input validation
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      throw new Error("Message text is required and must be non-empty");
    }

    if (!["USER", "AI"].includes(sender)) {
      throw new Error('Sender must be either "USER" or "AI"');
    }

    const user = await checkUser();
    if (!user) {
      return null;
    }

    // Sanitize text (trim and limit length)
    const sanitizedText = text.trim().slice(0, 10000);

    const newMessage = await prisma.message.create({
      data: {
        content: sanitizedText,
        sender,
        clerkId: user.clerkId,
      },
    });

    return newMessage;
  } catch (error) {
    console.error("Error creating message:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to create message: ${error.message}`);
    }
    throw new Error("Failed to create message: Unknown error");
  }
};

/**
 * Retrieves all messages for the current user
 * @returns Array of messages or null if user not authenticated
 * @throws Error if database operation fails
 */
export const getMessages = async () => {
  try {
    const user = await checkUser();
    if (!user) {
      return null;
    }

    const messages = await prisma.message.findMany({
      where: { clerkId: user.clerkId },
      orderBy: { createdAt: "asc" },
    });

    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }
    throw new Error("Failed to fetch messages: Unknown error");
  }
};
