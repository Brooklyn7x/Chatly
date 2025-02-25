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

  // Show connection status alert
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isConnecting) {
      // Show connecting status immediately
      setShowConnectionAlert(true);
      setReconnecting(false);
    } else if (!isConnected) {
      // Show disconnected status after a short delay
      setReconnecting(reconnectCount > 0);
      timer = setTimeout(() => {
        setShowConnectionAlert(true);
      }, 2000); // Show alert after 2 seconds of no connection
    } else {
      // Hide alert after a delay when connected
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
    <div className="flex flex-col h-dvh overflow-hidden">
      {showConnectionAlert && (
        <Alert
          variant={
            isConnecting ? "default" : reconnecting ? "default" : "destructive"
          }
          className={`m-2 w-[500px] mx-auto bg-transparent transition-all duration-300 ${
            isConnecting
              ? "bg-blue-500 border-blue-200 "
              : reconnecting
                ? "bg-amber-500 border-amber-200 "
                : isConnected
                  ? "bg-green-500"
                  : "bg-red-400"
          }`}
        >
          {isConnecting ? (
            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
          ) : reconnecting ? (
            <Wifi className="h-4 w-4 text-amber-500" />
          ) : isConnected ? (
            <></>
          ) : (
            <WifiOff className="h-4 w-4" />
          )}
          <AlertTitle>
            {isConnecting
              ? "Connecting..."
              : reconnecting
                ? "Reconnecting..."
                : isConnected
                  ? "Connected"
                  : "Connection Error"}
          </AlertTitle>
          <AlertDescription>
            {isConnecting
              ? "Establishing connection to the chat server..."
              : reconnecting
                ? `Attempting to reconnect to the chat server (attempt ${reconnectCount})...`
                : isConnected
                  ? "Connected"
                  : connectionError ||
                    "Unable to connect to chat server. Please check your internet connection."}
          </AlertDescription>
        </Alert>
      )}
      <div className="flex flex-1 overflow-hidden">
        <SideBar isMobile={isMobile} />
        <ChatContainer isMobile={isMobile} />
      </div>
    </div>
  );
}
