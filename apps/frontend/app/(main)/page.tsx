"use client";
import { useCallback, useEffect } from "react";
import { useUIStore } from "@/store/useUiStore";
import SideBar from "../../components/sidebar/Sidebar";
import ChatArea from "../../components/chat/ChatWindow";
import { useChatStore } from "@/store/useChatStore";

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

  return (!isMobile || selectedChatId) && <ChatArea />;
}
