"use client";
import { Suspense, useState } from "react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import SidebarHeader from "./SidebarHeader";
import SidebarContent from "./SidebarContent";
import { SidebarSkeleton } from "./SidebarSkeleton";
import { useChatStore } from "@/store/useChatStore";
import { ViewType } from "@/types";

const FBActionButton = dynamic(() => import("./FloatingActionButton"), {
  ssr: false,
});

interface SidebarProps {
  isMobile: Boolean;
}

const Sidebar = ({ isMobile }: SidebarProps) => {
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
      <Suspense fallback={<SidebarSkeleton />}>
        <SidebarContent
          view={view}
          searchQuery={searchQuery}
          onViewChange={setView}
        />
      </Suspense>

      {view === "main" && <FBActionButton onViewChange={setView} />}
    </div>
  );
};

export default Sidebar;
