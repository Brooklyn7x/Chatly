"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import SidebarHeader from "./SidebarHeader";
import SidebarContent from "./SidebarContent";
import { useChatStore } from "@/store/useChatStore";
import FloatingActionButton from "./FloatingActionButton";

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
  // const { fetchChats } = useChats();
  // useEffect(() => {
  //   fetchChats();
  // }, []);

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

      <SidebarContent
        view={view}
        searchQuery={searchQuery}
        onViewChange={setView}
      />

      {view === "main" && <FloatingActionButton onViewChange={setView} />}
    </div>
  );
}
