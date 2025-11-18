"use client";
import MessageView from "@/components/message-view";
import { ModeToggle } from "@/components/mode-toggle";
import TasksView from "@/components/tasks-view";
import AiInput from "@/components/ui/ai-input";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserButton } from "@clerk/nextjs";
import { CheckSquare2, Github, MessageSquare } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

type Props = {};

function page({}: Props) {
  const { resolvedTheme } = useTheme();

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Sleek Header */}
      <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4 sm:px-6 lg:px-8 flex-shrink-0 z-50 shadow-sm">
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3 hover:opacity-80 transition-all duration-200 group"
        >
          <div className="relative flex items-center justify-center">
            <Image
              src={
                resolvedTheme === "dark" ? "/dark_logo.svg" : "/light_logo.svg"
              }
              alt="Task Fusion Logo"
              width={32}
              height={32}
              className="w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-200 group-hover:scale-110"
            />
          </div>
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            Task Fusion
          </h1>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-9 w-9 sm:h-10 sm:w-10 hover:bg-accent/60 transition-all duration-200 rounded-lg"
          >
            <a
              href="https://github.com/lwshakib/task-fusion-ai-powered"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
            >
              <Github className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
          </Button>
          <ModeToggle />
          <div className="ml-0.5">
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        {/* Mobile/Tablet: Enhanced Tabs */}
        <div className="block lg:hidden h-full">
          <Tabs defaultValue="messages" className="w-full h-full flex flex-col">
            <div className="px-4 pt-4 pb-3 border-b border-border/50 bg-background/60 backdrop-blur-sm">
              <TabsList className="w-full grid grid-cols-2 bg-muted/60 h-11 gap-1 p-1">
                <TabsTrigger
                  value="messages"
                  className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200 rounded-md flex items-center justify-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Chat</span>
                </TabsTrigger>
                <TabsTrigger
                  value="tasks"
                  className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200 rounded-md flex items-center justify-center gap-2"
                >
                  <CheckSquare2 className="h-4 w-4" />
                  <span>Tasks</span>
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent
              value="messages"
              className="flex-1 flex flex-col min-h-0 mt-0 bg-background"
            >
              <div className="flex-1 min-h-0 p-4 sm:p-6 overflow-hidden">
                <MessageView />
              </div>
              <div className="border-t border-border/50 bg-background/95 backdrop-blur-sm flex-shrink-0 px-4 sm:px-6 py-3">
                <AiInput />
              </div>
            </TabsContent>
            <TabsContent
              value="tasks"
              className="flex-1 min-h-0 mt-0 bg-background"
            >
              <TasksView />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop: Enhanced Resizable Panels */}
        <div className="hidden lg:block h-full">
          <ResizablePanelGroup direction="horizontal" className="h-full w-full">
            {/* Chat Panel */}
            <ResizablePanel defaultSize={50} minSize={30} maxSize={70}>
              <div className="flex h-full flex-col bg-background border-r border-border/50 shadow-sm">
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-border/50 bg-muted/30 backdrop-blur-sm flex items-center gap-2 flex-shrink-0">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-base font-semibold">AI Assistant</h2>
                </div>
                {/* Chat Content */}
                <div className="flex-1 min-h-0 p-4 xl:p-6 overflow-hidden">
                  <MessageView />
                </div>
                {/* Chat Input */}
                <div className="border-t border-border/50 bg-background/95 backdrop-blur-sm flex-shrink-0 px-4 xl:px-6 py-4">
                  <AiInput />
                </div>
              </div>
            </ResizablePanel>

            {/* Resizable Handle */}
            <ResizableHandle
              withHandle
              className="bg-border/30 hover:bg-border/50 transition-colors duration-200 w-1 group hover:w-1.5"
            />

            {/* Tasks Panel */}
            <ResizablePanel defaultSize={50} minSize={30} maxSize={70}>
              <div className="h-full bg-background flex flex-col shadow-sm">
                {/* Tasks Header */}
                <div className="px-6 py-4 border-b border-border/50 bg-muted/30 backdrop-blur-sm flex items-center gap-2 flex-shrink-0">
                  <CheckSquare2 className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-base font-semibold">Tasks</h2>
                </div>
                {/* Tasks Content */}
                <div className="flex-1 min-h-0 overflow-hidden">
                  <TasksView />
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}

export default page;
