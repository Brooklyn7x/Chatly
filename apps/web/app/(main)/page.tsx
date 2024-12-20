"use client";
import { useCallback, useEffect, useState } from "react";
import { useUIStore } from "@/store/ui-store";
import SideBar from "../../components/sidebar/Sidebar";
import ChatArea from "../../components/chat/ChatArea";
import { useChatStore } from "@/store/chat-store";

export default function MainLayout() {
  const { isMobile, setIsMobile } = useUIStore();
  const { selectedChatId } = useChatStore();

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, [setIsMobile]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);
  return (
    <div className="flex h-dvh overflow-hidden">
      <SideBar />
      {(!isMobile || selectedChatId) && <ChatArea />}
    </div>
  );
}
