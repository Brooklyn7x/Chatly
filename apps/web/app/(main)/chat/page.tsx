"use client";

import ChatContainer from "@/components/chat/ChatContainer";
import Sidebar from "@/components/sidebar/Sidebar";
import { useMobileDetection } from "@/hooks/useMobileDetection";
import { useChatStore } from "@/store/useChatStore";
import { useEffect } from "react";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useSocketStore } from "@/store/useSocketStore";
import { useUserStatusSocket } from "@/hooks/useUserStatusSocket";

export default function MainPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const { connect, disconnect } = useSocketStore();
  const { isMobile } = useMobileDetection();
  const { activeChatId } = useChatStore();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (isAuthenticated) {
        router.push("/chat");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [isAuthenticated, connect, disconnect]);

  useUserStatusSocket();

  if (isLoading) return null;
  if (!isAuthenticated) return null;

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
