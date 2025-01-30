"use client";

import { useState } from "react";
import { useUIStore } from "@/store/useUiStore";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/useChatStore";
import SidebarHeader from "./SidebarHeaders";
import SidebarContent from "./SidebarContent";
import { FloatingActionButton } from "./FloatingActionButton";
import { DirectModal } from "../modal/DirectModal";
import { GroupModal } from "../modal/GroupModal";

export default function SideBar() {
  const { isMobile } = useUIStore();
  const { activeChatId } = useChatStore();

  const [view, setView] = useState<
    "main" | "search" | "settings" | "contacts" | "archived"
  >("main");

  const [groupModal, setGroupModal] = useState(false);
  const [channelModal, setChannelModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
      <div>
        <SidebarHeader
          view={view}
          onViewChange={setView}
          onMenuToggle={() => setMenuOpen(true)}
        />

        <SidebarContent view={view} />

        <FloatingActionButton
          view={view}
          onNewMessage={() => setView("contacts")}
          onNewChannel={() => setChannelModal(true)}
          onNewGroup={() => setGroupModal(true)}
        />
      </div>

      {channelModal && (
        <DirectModal
          isOpen={channelModal}
          onClose={() => setChannelModal(false)}
        />
      )}
      {groupModal && (
        <GroupModal isOpen={groupModal} onClose={() => setGroupModal(false)} />
      )}
    </aside>
  );
}
