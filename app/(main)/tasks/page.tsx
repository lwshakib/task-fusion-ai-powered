import { Logo } from "@/components/logo";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function TasksPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-6 bg-background">
        <Logo />
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          {/* Left Column: Chat Bar */}
          <ResizablePanel
            defaultSize={30}
            minSize={20}
            maxSize={40}
            className="bg-muted/5"
          >
            <div className="flex h-full flex-col p-4">
              <div className="flex-1 rounded-xl border bg-background p-4 shadow-sm">
                <h2 className="font-semibold mb-2">Chat</h2>
                <div className="text-muted-foreground text-sm">
                  Chat interface will be here.
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Column: Task Management System */}
          <ResizablePanel defaultSize={70} className="bg-background">
            <div className="flex h-full flex-col p-4">
              <div className="flex-1 rounded-xl border bg-card p-4 shadow-sm">
                <h2 className="font-semibold mb-2">Task Management</h2>
                <div className="text-muted-foreground text-sm">
                  Task board will be here.
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
