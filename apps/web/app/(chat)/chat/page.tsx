"use client";
import { useEffect } from "react";
import { useSocketStore } from "@/store/useSocketStore";
import { useUserStatusSocket } from "@/hooks/user/useUserStatusSocket";
import ChatContainer from "@/components/chat/ChatContainer";
import Sidebar from "@/components/sidebar/Sidebar";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function MainPage() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  const { connect, disconnect } = useSocketStore();

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  useUserStatusSocket();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) return null;

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
