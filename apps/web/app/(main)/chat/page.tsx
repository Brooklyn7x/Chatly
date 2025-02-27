"use client";
import { ChatContainer } from "@/components/chat/ChatContainer";
import AuthGuard from "@/components/shared/AuthGuard";
import SideBar from "@/components/sidebar/Sidebar";
import { useSocket } from "@/hooks/useSocket";
import { useMessageSocket } from "@/hooks/useMessageSocket";
import { useUserStatusSocket } from "@/hooks/useUserStatusSocket";
import { useCallback, useEffect, useState } from "react";
import { Wifi, WifiOff, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function MainPage() {
  const [isMobile, setIsMobile] = useState(false);
  const {
    isConnected,
    isConnecting,
    connectionError,
    reconnectCount,
    connectionState,
  } = useSocket();
  const [showConnectionAlert, setShowConnectionAlert] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, [setIsMobile]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isConnecting) {
      setShowConnectionAlert(true);
      setReconnecting(false);
    } else if (!isConnected) {
      setReconnecting(reconnectCount > 0);
      timer = setTimeout(() => {
        setShowConnectionAlert(true);
      }, 2000);
    } else {
      timer = setTimeout(() => {
        setShowConnectionAlert(false);
      }, 1500);
      setReconnecting(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isConnected, isConnecting, reconnectCount]);

  useUserStatusSocket();
  useMessageSocket();

  return (
    <AuthGuard requireAuth>
      <div className="flex flex-col h-dvh overflow-hidden">
        <div
          className={`fixed top-0 left-0 right-0 h-1 transition-all duration-300 z-50 ${
            showConnectionAlert
              ? isConnecting
                ? "bg-blue-500"
                : reconnecting
                  ? "bg-amber-500"
                  : isConnected
                    ? "bg-green-500"
                    : "bg-red-500"
              : "opacity-0"
          }`}
        />

        <div
          className={`fixed top-1 left-0 right-0 text-center text-sm py-1 transition-all duration-300 ${
            showConnectionAlert
              ? isConnecting
                ? "text-blue-500 opacity-100"
                : reconnecting
                  ? "text-amber-500 opacity-100"
                  : isConnected
                    ? "text-green-500 opacity-100"
                    : "text-red-500 opacity-100"
              : "opacity-0"
          }`}
        >
          {isConnecting
            ? "Connecting to chat server..."
            : reconnecting
              ? `Reconnecting to chat server (attempt ${reconnectCount})...`
              : isConnected
                ? "Connected to chat server"
                : connectionError || "Connection error"}
        </div>

        <div className="flex flex-1 overflow-hidden">
          <SideBar isMobile={isMobile} />
          <ChatContainer isMobile={isMobile} />
        </div>
      </div>
    </AuthGuard>
  );
}
