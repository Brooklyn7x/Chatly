"use client";
import { useCallback, useEffect } from "react";
import { useChatStore } from "@/store/useChatStore";
import SideBar from "../../components/sidebar/Sidebar";
import ChatArea from "../../components/chat/ChatArea";

export default function MainLayout() {
  const { sidebarOpen, toggleSidebar } = useChatStore();
  const handleSize = useCallback(() => {
    const isMobile = window.innerWidth <= 786;
    if (!isMobile && !sidebarOpen) {
      toggleSidebar();
    } else if (isMobile && sidebarOpen) {
      toggleSidebar();
    }
  }, [sidebarOpen, toggleSidebar]);
  useEffect(() => {
    handleSize();
    window.addEventListener("resize", handleSize);
    return () => {
      window.removeEventListener("resize", handleSize);
    };
  }, [handleSize]);
  return (
    <div className="flex h-screen">
      {sidebarOpen && <SideBar />}
      <ChatArea />
    </div>
  );
}
