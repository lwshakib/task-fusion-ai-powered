import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Task Fusion - AI Generated Task List Based on Priority",
  description:
    "Intelligent task management powered by AI. Organize, prioritize, and complete tasks efficiently with AI-generated task lists based on priority and context.",
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/favicon/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/favicon/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: [shadcn],
      }}
    >
      <html lang="en">
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
