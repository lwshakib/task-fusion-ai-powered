import { Logo } from '@/components/layout/logo';
import { ModeToggle } from '@/components/layout/mode-toggle';
import { UserNav } from '@/components/tasks/user-nav';
import { ClearMessagesButton } from '@/components/tasks/clear-messages-button';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ChatInterface } from '@/components/tasks/chat-interface';
import { TaskList } from '@/components/tasks/task-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquareIcon, ListTodoIcon } from 'lucide-react';
import { UsageText } from '@/components/tasks/usage-text';

/**
 * TasksPage Component
 * The main application dashboard where users interact with the AI assistant
 * and manage their task list. Supports both mobile and desktop layouts.
 */
export default function TasksPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* 
        Global Application Header
        Contains the logo, AI usage stats, and user account/theme controls.
      */}
      <header className="flex h-16 shrink-0 items-center justify-between px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <Logo />
        <div className="flex items-center gap-4">
          <UsageText />
          <ClearMessagesButton />
          <div className="h-6 w-px bg-border hidden sm:block" />
          <ModeToggle />
          <UserNav />
        </div>
      </header>

      {/* Main Content Area: Responsive Layout Switcher */}
      <div className="flex-1 overflow-hidden">
        {/* 
          Mobile View: Tabbed Navigation
          Users switch between the AI chat and the task list using bottom tabs.
        */}
        <div className="md:hidden h-full">
          <Tabs defaultValue="chat" className="h-full gap-0">
            <div className="flex-1 overflow-hidden relative">
              {/* Chat view for mobile */}
              <TabsContent
                value="chat"
                className="h-full m-0 data-[state=inactive]:hidden flex flex-col"
              >
                <ChatInterface />
              </TabsContent>
              {/* Task list view for mobile */}
              <TabsContent
                value="tasks"
                className="h-full m-0 data-[state=inactive]:hidden flex flex-col"
              >
                <TaskList />
              </TabsContent>
            </div>
            {/* Bottom Tab Bar for Mobile */}
            <TabsList className="flex h-16 w-full rounded-none border-t bg-background p-0 shrink-0">
              <TabsTrigger
                value="chat"
                className="flex-1 h-full rounded-none data-[state=active]:bg-muted/50 data-[state=active]:text-primary gap-2"
              >
                <MessageSquareIcon className="size-4" />
                Assistant
              </TabsTrigger>
              <TabsTrigger
                value="tasks"
                className="flex-1 h-full rounded-none data-[state=active]:bg-muted/50 data-[state=active]:text-primary gap-2"
              >
                <ListTodoIcon className="size-4" />
                Tasks
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* 
          Desktop View: Resizable Multi-Pane Interface
          Allows simultaneous viewing of the AI chat (left) and task list (right).
        */}
        <div className="hidden md:block h-full">
          <ResizablePanelGroup direction="horizontal" className="h-full w-full">
            {/* Left Column: AI Assistant & Chat Interface */}
            <ResizablePanel
              defaultSize={30}
              minSize={25}
              maxSize={40}
              className="bg-muted/5 border-r"
            >
              <ChatInterface />
            </ResizablePanel>

            {/* Draggable divider handle for resizing panels */}
            <ResizableHandle withHandle />

            {/* Right Column: Task Management & Kanban System */}
            <ResizablePanel defaultSize={70} className="bg-background">
              <TaskList />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}
