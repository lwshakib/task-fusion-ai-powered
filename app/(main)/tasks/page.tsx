import { Logo } from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ChatInterface } from "@/components/tasks/chat-interface";
import { TaskList } from "@/components/tasks/task-list";

export default function TasksPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <Logo />
        <ModeToggle />
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          {/* Left Column: Chat Bar */}
          <ResizablePanel
            defaultSize={30}
            minSize={25}
            maxSize={40}
            className="bg-muted/5 border-r"
          >
            <ChatInterface />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Column: Task Management System */}
          <ResizablePanel defaultSize={70} className="bg-background">
            <TaskList />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
