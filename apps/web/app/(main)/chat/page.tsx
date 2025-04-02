"use client";
import { useEffect } from "react";

import { useMobileDetection } from "@/hooks/useMobileDetection";
import { useChatStore } from "@/store/useChatStore";

import { useSocketStore } from "@/store/useSocketStore";
import { useUserStatusSocket } from "@/hooks/useUserStatusSocket";
import { useAuth } from "@/hooks/useAuth";
import ChatContainer from "@/components/chat/ChatContainer";
import Sidebar from "@/components/sidebar/Sidebar";

export default function MainPage() {
  const { connect, disconnect } = useSocketStore();
  const { isMobile } = useMobileDetection();
  const { activeChatId } = useChatStore();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  useUserStatusSocket();

  if (isLoading) return null;
  // if (!isAuthenticated) return null;

  return (
    <div className="max-w-9xl mx-auto bg-black/80">
      <div className="flex flex-col h-dvh border">
        <div className="flex flex-1 overflow-hidden w-full">
          <Sidebar isMobile={isMobile} />
          {(!isMobile || activeChatId) && <ChatContainer isMobile={isMobile} />}
        </div>
      </div>
    </div>
  );
}
