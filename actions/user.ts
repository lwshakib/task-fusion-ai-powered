"use server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * Checks if user exists in database, creates one if not found
 * @returns User object or null if authentication fails
 * @throws Error if database operation fails
 */
export async function checkUser() {
  try {
    const user = await currentUser();
    if (!user) {
      return null;
    }

    // Check if user exists
    const existUser = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (existUser) {
      return existUser;
    }

    // Create new user if doesn't exist
    const name = `${user.firstName || ""} ${
      user.lastName || ""
    }`.trim() || "User";

    if (!user.emailAddresses?.[0]?.emailAddress) {
      throw new Error("User email address is required");
    }

    const newUser = await prisma.user.create({
      data: {
        clerkId: user.id,
        name,
        imageUrl: user.imageUrl || "",
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error in checkUser:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to check/create user: ${error.message}`);
    }
    throw new Error("Failed to check/create user: Unknown error");
  }
}