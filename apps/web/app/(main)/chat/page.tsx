"use client";

import { ChatContainer } from "@/components/chat/ChatContainer";
import AuthGuard from "@/components/shared/AuthGuard";
import Sidebar from "@/components/sidebar/Sidebar";
import { useUserStatusSocket } from "@/hooks/useUserStatusSocket";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { useMobileDetection } from "@/hooks/useMobileDetection";
import ConnectionStatusBar from "@/components/shared/ConnectionStatusBar";
import { useChatStore } from "@/store/useChatStore";

export default function MainPage() {
  const { connectionStatus } = useConnectionStatus();
  const { isMobile } = useMobileDetection();
  const { activeChatId } = useChatStore();
  useUserStatusSocket();

  return (
    <AuthGuard requireAuth>
      <div className="max-w-7xl mx-auto bg-black/80">
        <div className="flex flex-col h-dvh border">
          <ConnectionStatusBar status={connectionStatus} />
          <div className="flex flex-1 overflow-hidden w-full">
            <Sidebar isMobile={isMobile} />
            {(!isMobile || activeChatId) && (
              <ChatContainer isMobile={isMobile} />
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
