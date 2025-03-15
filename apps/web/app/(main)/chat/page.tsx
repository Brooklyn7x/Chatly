"use client";
import { useMemo } from "react";
import { ChatContainer } from "@/components/chat/ChatContainer";
import AuthGuard from "@/components/shared/AuthGuard";
import Sidebar from "@/components/sidebar/Sidebar";
import { useUserStatusSocket } from "@/hooks/useUserStatusSocket";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { useMobileDetection } from "@/hooks/useMobileDetection";
import ConnectionStatusBar from "@/components/ConnectionStatusBar";

export default function MainPage() {
  const { connectionStatus } = useConnectionStatus();
  const { isMobile } = useMobileDetection();
  useUserStatusSocket();

  return (
    <AuthGuard requireAuth>
      <div className="flex flex-col h-dvh overflow-hidden">
        <ConnectionStatusBar status={connectionStatus} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar isMobile={isMobile} />
          <ChatContainer isMobile={isMobile} />
        </div>
      </div>
    </AuthGuard>
  );
}
