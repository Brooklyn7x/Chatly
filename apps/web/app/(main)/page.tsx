"use client";
import { useEffect } from "react";
import ChatSideBar from "../components/layout/ChatSidebar";
import ChatMainArea from "../components/layout/ChatMainArea";

export default function ChatLayout() {
  return (
    <div className="h-dvh flex overflow-hidden">
      {/* <ChatSideBar /> */}
      <ChatMainArea />
    </div>
  );
}


