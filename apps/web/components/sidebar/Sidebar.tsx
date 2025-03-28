"use client";

import { Suspense, useState } from "react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import SidebarContent from "./SidebarContent";
import { useChatStore } from "@/store/useChatStore";
import { ViewType } from "@/types";
import { fetchChats } from "@/hooks/useChats";

const FBActionButton = dynamic(() => import("./FloatingActionButton"), {
  ssr: false,
});

interface SidebarProps {
  isMobile: Boolean;
}

const Sidebar = ({ isMobile }: SidebarProps) => {
  const { activeChatId } = useChatStore();
  const [view, setView] = useState<ViewType>("main");

  fetchChats();

  return (
    <div
      className={cn(
        "w-full md:w-[420px] md:border-r flex flex-col relative",
        "backdrop-blur-sm bg-background/60",
        isMobile && activeChatId ? "-translate-x-full" : "translate-x-0",
        !isMobile ? "" : "absolute inset-y-0 left-0 z-10"
      )}
    >
      <Suspense
        fallback={<div className="p-4 text-center">Loading chats...</div>}
      >
        <SidebarContent
          view={view}
          onViewChange={setView}
        />
      </Suspense>

      {view === "main" && <FBActionButton onViewChange={setView} />}
    </div>
  );
};

export default Sidebar;
