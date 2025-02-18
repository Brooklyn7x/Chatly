"use client";
import { ChatContainer } from "@/components/chat/ChatContainer";
import AuthGuard from "@/components/shared/AuthGuard";
import SideBar from "@/components/sidebar/Sidebar";
import { useAppInitialization } from "@/hooks/useAppInitialization";
import { useLayout } from "@/hooks/useLayout";
import { useMessageSocket } from "@/hooks/useMessageSocket";
import { useTypingSocket } from "@/hooks/useTypingSocket";

import { useUserStatusSocket } from "@/hooks/useUserStatusSocket";
export default function MainPage() {
  const { activeChatId, isMobile } = useLayout();
  useAppInitialization();
  useUserStatusSocket();
  useMessageSocket();
  // useTypingSocket();

  return (
    <AuthGuard requireAuth={true}>
      <div className="flex h-dvh overflow-hidden">
        <SideBar />
        {(!isMobile || activeChatId) && <ChatContainer />}
      </div>
    </AuthGuard>
  );
}
