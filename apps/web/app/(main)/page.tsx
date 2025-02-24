"use client";
import { ChatContainer } from "@/components/chat/ChatContainer";
import AuthGuard from "@/components/shared/AuthGuard";
import SideBar from "@/components/sidebar/Sidebar";
import { useSocket } from "@/hooks/useSocket";
import { useMessageSocket } from "@/hooks/useMessageSocket";
import { useUserStatusSocket } from "@/hooks/useUserStatusSocket";
import { useCallback, useEffect, useState } from "react";
export default function MainPage() {
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, [setIsMobile]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useSocket();
  useUserStatusSocket();
  useMessageSocket();

  return (
    <AuthGuard requireAuth={true}>
      <div className="flex h-dvh overflow-hidden">
        <SideBar isMobile={isMobile} />
        <ChatContainer isMobile={isMobile} />
      </div>
    </AuthGuard>
  );
}
