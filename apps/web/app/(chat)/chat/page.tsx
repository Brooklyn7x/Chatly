"use client";
import { useEffect } from "react";
import { useSocketStore } from "@/store/useSocketStore";
import { useUserStatusSocket } from "@/hooks/user/useUserStatusSocket";
import ChatContainer from "@/components/chat/ChatContainer";
import Sidebar from "@/components/sidebar/Sidebar";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function MainPage() {
  const router = useRouter();
  const { isLoggedIn, loading } = useAuthStore();
  const { connect, disconnect } = useSocketStore();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace("/login");
    }
  }, [loading, isLoggedIn, router]);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  useUserStatusSocket();

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-dvh bg-background">
        <div className="space-y-4 w-full mx-auto max-w-md p-4"></div>
          <div className="flex items-center justify-center">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-8 w-3/4 rounded-lg" />
          <Skeleton className="h-8 w-1/2 rounded-lg" />
          <Skeleton className="h-8 w-3/4 rounded-lg" />
          <Skeleton className="h-8 w-3/4 rounded-lg" />
          <Skeleton className="h-8 w-1/2 rounded-lg" />
          <Skeleton className="h-8 w-3/4 rounded-lg" />
        </div>
      </div>
    );
  if (!isLoggedIn) return null;

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
