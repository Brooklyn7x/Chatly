"use client";
import { ChatContainer } from "@/components/chat/ChatContainer";
import AuthGuard from "@/components/shared/AuthGuard";
import SideBar from "@/components/sidebar/Sidebar";
import { useSocket } from "@/hooks/useSocket";
import { useLayout } from "@/hooks/useLayout";
import { useMessageSocket } from "@/hooks/useMessageSocket";
import { useUserStatusSocket } from "@/hooks/useUserStatusSocket";
import { useEffect } from "react";
export default function MainPage() {
  const { activeChatId, isMobile } = useLayout();

  useSocket();
  useUserStatusSocket();
  useMessageSocket();

  return (
    <AuthGuard requireAuth={true}>
      <div className="flex h-dvh overflow-hidden">
        <SideBar />
        {(!isMobile || activeChatId) && <ChatContainer />}
      </div>
    </AuthGuard>
  );
}
