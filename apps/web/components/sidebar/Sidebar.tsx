"use client";
import { Suspense, useState } from "react";
import { cn } from "@/lib/utils";
import SidebarHeader from "./SidebarHeader";
import SidebarContent from "./SidebarContent";
import { useChatStore } from "@/store/useChatStore";
import FloatingActionButton from "./FloatingActionButton";
import { Skeleton } from "@/components/ui/skeleton";

type ViewType =
  | "main"
  | "search"
  | "new_message"
  | "new_group"
  | "new_channel"
  | "setting"
  | "theme_setting";

interface SidebarProps {
  isMobile: Boolean;
}

export default function Sidebar({ isMobile }: SidebarProps) {
  const { activeChatId } = useChatStore();
  const [view, setView] = useState<ViewType>("main");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div
      className={cn(
        "w-full md:w-[420px] md:border-r flex flex-col relative",
        "backdrop-blur-sm bg-background/60",
        isMobile && activeChatId ? "-translate-x-full" : "translate-x-0",
        !isMobile ? "" : "absolute inset-y-0 left-0 z-10"
      )}
    >
      {view === "main" && (
        <SidebarHeader
          view={view}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onViewChange={setView}
        />
      )}
      <Suspense
        fallback={
          <div className="space-y-4 p-4">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                </div>
              ))}
          </div>
        }
      >
        <SidebarContent
          view={view}
          searchQuery={searchQuery}
          onViewChange={setView}
        />
      </Suspense>

      {view === "main" && <FloatingActionButton onViewChange={setView} />}
    </div>
  );
}
