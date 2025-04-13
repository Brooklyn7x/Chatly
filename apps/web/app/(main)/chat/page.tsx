"use client";
import { useEffect } from "react";
import { useSocketStore } from "@/store/useSocketStore";
import { useUserStatusSocket } from "@/hooks/user/useUserStatusSocket";
import ChatContainer from "@/components/newlooks/chat/ChatContainer";
import Sidebar from "@/components/newlooks/sidebar/Sidebar";

export default function MainPage() {
  const { connect, disconnect } = useSocketStore();

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  useUserStatusSocket();

  return (
    <div className="h-dvh max-w-8xl mx-auto bg-background/60">
      <div className="flex h-full">
        <Sidebar />
        <div className="flex flex-1 w-full">
          <ChatContainer />
        </div>
      </div>
    </div>
  );
}
