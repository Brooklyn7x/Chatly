"use client";
import { useEffect, useState } from "react";
import ChatSideBar from "../components/layout/ChatSidebar";
import ChatMainArea from "../components/layout/ChatMainArea";
import AuthContainer from "../components/auth/AuthContainer";

export default function ChatLayout() {
  const [isAuth, setIsAuth] = useState(true);

  return (
    <div className="relative">
      {isAuth ? (
        <AuthContainer />
      ) : (
        <div className="h-dvh flex overflow-hidden">
          <ChatSideBar />
          <ChatMainArea />
        </div>
      )}
      <button
        onClick={() => setIsAuth(!isAuth)}
        className="absolute top-5 right-5 p-2 border"
      >
        AuthButton
      </button>
    </div>
  );
}
