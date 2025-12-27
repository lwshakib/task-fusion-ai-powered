import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function Loading() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Header Skeleton */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-6 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-10">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-28 hidden sm:block" />
          <div className="h-6 w-px bg-border hidden sm:block" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </header>

      {/* Main Content Skeleton */}
      <div className="flex-1 overflow-hidden">
        {/* Desktop View Skeleton */}
        <div className="hidden md:flex h-full">
          {/* Chat Panel Skeleton */}
          <div className="w-[30%] border-r bg-muted/5 flex flex-col">
            <div className="flex-1 p-6 space-y-6 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-3",
                    i % 2 === 1 && "flex-row-reverse"
                  )}
                >
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div
                    className={cn(
                      "space-y-2 flex-1 max-w-[80%]",
                      i % 2 === 1 && "items-end flex flex-col"
                    )}
                  >
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 mt-auto border-t bg-background">
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          </div>

          {/* Task List Panel Skeleton */}
          <div className="flex-1 flex flex-col bg-background">
            <div className="p-6 border-b flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-64" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
            <div className="flex-1 p-6 space-y-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-lg border p-4"
                >
                  <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <div className="flex gap-4 items-center">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile View Skeleton */}
        <div className="md:hidden h-full flex flex-col">
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Imitate active Chat tab */}
            <div className="flex-1 p-4 space-y-6 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-3",
                    i % 2 === 1 && "flex-row-reverse"
                  )}
                >
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div
                    className={cn(
                      "space-y-2 flex-1 max-w-[80%]",
                      i % 2 === 1 && "items-end flex flex-col"
                    )}
                  >
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t bg-background">
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          </div>
          {/* Mobile Tab Bar Skeleton */}
          <div className="h-16 border-t flex items-center px-4 gap-4 bg-background">
            <Skeleton className="h-10 flex-1 rounded-md" />
            <Skeleton className="h-10 flex-1 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
