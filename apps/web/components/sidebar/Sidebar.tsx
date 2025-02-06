"use client";

import { useState } from "react";
import { useUIStore } from "@/store/useUiStore";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/useChatStore";
import SidebarHeader from "./SidebarHeader";
import SidebarContent from "./SidebarContent";
import { FloatingActionButton } from "./FloatingActionButton";

export default function SideBar() {
  const { isMobile } = useUIStore();
  const { activeChatId } = useChatStore();

  const [view, setView] = useState<
    | "main"
    | "search"
    | "settings"
    | "contacts"
    | "archived"
    | "new_message"
    | "new_group"
    | "new_channel"
  >("main");

  return (
    <aside
      className={cn(
        "w-full md:w-[420px] md:border-r",
        "flex flex-col relative",
        isMobile && activeChatId ? "-translate-x-full" : "translate-x-0",
        "transition-[transform,width] duration-200 ease-in-out",
        "md:translate-x-0",
        isMobile ? "absolute inset-y-0 left-0 z-10" : "relative"
      )}
    >
      <SidebarHeader view={view} onViewChange={setView} />
      <SidebarContent view={view} onBack={() => setView("main")} />
      <FloatingActionButton view={view} onViewChange={setView} />
    </aside>
  );
}
