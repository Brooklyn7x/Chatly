"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import SidebarHeader from "./SidebarHeader";
import SidebarContent from "./SidebarContent";
import { useLayout } from "@/hooks/useLayout";
import { FloatingActionButton } from "./FloatingActionButton";

type ViewType = "main" | "search" | "new_message" | "new_group" | "new_channel";

export default function Sidebar() {
  const { isMobile, activeChatId } = useLayout();
  const [view, setView] = useState<ViewType>("main");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div
      className={cn(
        "w-full md:w-[420px] md:border-r flex flex-col relative",
        "backdrop-blur-sm bg-background/60",
        isMobile && activeChatId ? "-translate-x-full" : "translate-x-0",
        isMobile ? "absolute inset-y-0 left-0 z-10" : "relative"
      )}
    >
      <SidebarHeader
        view={view}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* <ChatFilters onChangeFilter={() => {}} /> */}

      <SidebarContent
        view={view}
        searchQuery={searchQuery}
        onViewChange={setView}
      />

      <FloatingActionButton view={view} onViewChange={setView} />
    </div>
  );
}
