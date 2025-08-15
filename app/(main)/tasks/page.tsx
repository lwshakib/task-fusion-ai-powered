"use client";
import MessageView from "@/components/message-view";
import { ModeToggle } from "@/components/mode-toggle";
import TasksView from "@/components/tasks-view";
import AiInput from "@/components/ui/ai-input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

type Props = {};

function page({}: Props) {
  const { resolvedTheme } = useTheme();

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      <header className="h-16 border-b flex items-center justify-between px-6 flex-shrink-0">
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <>
            <Image
              src={
                resolvedTheme === "dark" ? "/dark_logo.svg" : "/light_logo.svg"
              }
              alt="Task Fusion Logo"
              width={32}
              height={32}
            />
            <h1 className="text-xl font-semibold">Task Fusion</h1>
          </>
        </Link>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserButton />
        </div>
      </header>
      <div className="flex-1 min-h-0 overflow-hidden">
        {/* Mobile/Tablet: Tabs */}
        <div className="block md:hidden h-full">
          <Tabs defaultValue="messages" className="w-full h-full flex flex-col">
            <TabsList className="w-full grid grid-cols-2 px-4 bg-transparent">
              <TabsTrigger value="messages">Chat</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
            </TabsList>
            <TabsContent
              value="messages"
              className="flex-1 flex flex-col min-h-0"
            >
              <div className="flex-1 min-h-0 p-6 overflow-hidden">
                <MessageView />
              </div>
              <div className="border-t flex-shrink-0">
                <AiInput />
              </div>
            </TabsContent>
            <TabsContent value="tasks" className="flex-1 min-h-0">
              <TasksView />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop: Resizable Panels */}
        <div className="hidden md:block h-full">
          <ResizablePanelGroup direction="horizontal" className="h-full w-full">
            <ResizablePanel defaultSize={50} minSize={25} maxSize={75}>
              <div className="flex h-full flex-col">
                <div className="flex-1 min-h-0 p-6 overflow-hidden">
                  <MessageView />
                </div>
                <div className="border-t flex-shrink-0">
                  <AiInput />
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} minSize={25} maxSize={75}>
              <TasksView />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}

export default page;
