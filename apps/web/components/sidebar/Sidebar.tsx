"use client";
import { cn } from "@/lib/utils";
import SidebarContent from "./SidebarContent";
import { useChatStore } from "@/store/useChatStore";
import { useConversationSocket } from "@/hooks/chat/useChatSocket";

interface SidebarProps {
  isMobile: Boolean;
}

const Sidebar = ({ isMobile }: SidebarProps) => {
  const activeChatId = useChatStore((state) => state.activeChatId);
  useConversationSocket();

  return (
    <div
      className={cn(
        "w-full md:w-[420px] md:border-r flex flex-col relative",
        "backdrop-blur-sm bg-background",
        isMobile && activeChatId ? "-translate-x-full" : "translate-x-0",
        !isMobile ? "" : "absolute inset-y-0 left-0 z-10"
      )}
    >
      <SidebarContent />
    </div>
  );
};

export default Sidebar;
