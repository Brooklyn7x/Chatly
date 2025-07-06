"use client";
import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import ChatContainer from "@/components/layout/ChatLayout";
import Sidebar from "@/components/features/sidebar/Sidebar";

export default function MainPage() {
  const { isAuthenticated, isLoading, isInitialized } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isInitialized, router]);

  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="h-dvh max-w-8xl mx-auto bg-background/60">
      <div className="flex h-full">
        <ErrorBoundary>
          <Sidebar />
        </ErrorBoundary>
        <ErrorBoundary>
          <div className="flex flex-1 w-full">
            <ChatContainer />
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}
