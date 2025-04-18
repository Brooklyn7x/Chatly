"use client";

import { useChatStore } from "@/store/useChatStore";
import { useConversationSocket } from "@/hooks/chat/useChatSocket";
import NewSidebar from "./NSidebar";

const Sidebar = () => {
  const activeChatId = useChatStore((state) => state.activeChatId);
  useConversationSocket();

  return (
    <div
      className={`w-full h-full md:w-[400px] overflow-hidden md:p-2 relative ${activeChatId ? "hidden md:block" : "block"}`}
    >
      <NewSidebar />
    </div>
  );
};

export default Sidebar;
