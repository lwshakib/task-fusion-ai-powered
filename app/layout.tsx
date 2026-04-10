import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { Toaster } from '@/components/ui/sonner';

/**
 * Global Metadata Configuration
 * Defines SEO titles, descriptions, icons, and social media previews for the entire application.
 */
export const metadata: Metadata = {
  title: 'Task Fusion AI - Intelligent Task Management & Automation',
  description:
    'Task Fusion AI is an intelligent, agent-driven productivity platform that helps you decompose goals, synthesize context, and prioritize your workflow using advanced AI models.',
  icons: {
    icon: [
      {
        url: '/favicon_io/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon_io/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      { url: '/favicon_io/favicon.ico' },
    ],
    apple: [
      {
        url: '/favicon_io/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  manifest: '/favicon_io/site.webmanifest',
  openGraph: {
    title: 'Task Fusion AI - Intelligent Task Management & Automation',
    description:
      'Intelligent, agent-driven productivity platform for high-performance teams and individuals.',
    type: 'website',
    siteName: 'Task Fusion AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Task Fusion AI',
    description: 'The intelligent agent for seamless task management.',
  },
};

/**
 * RootLayout Component
 * The top-level layout that wraps the entire application.
 * Manages global providers: Theme (Dark/Light mode) and Toast notifications.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased font-sans">
        {/* ThemeProvider manages light/dark mode based on user preference or system settings */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Main application content */}
          {children}

          {/* Toaster component manages global floating notifications */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
