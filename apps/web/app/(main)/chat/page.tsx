"use client";

import { useCallback, useEffect } from "react";
import { useUIStore } from "@/store/useUiStore";
import { useChatStore } from "@/store/useChatStore";
import ChatWindow from "@/components/chat/ChatWindow";

export default function MainLayout() {
  const { isMobile, setIsMobile } = useUIStore();
  const { activeChatId } = useChatStore();

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, [setIsMobile]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return (!isMobile || activeChatId) && <ChatWindow />;
}
