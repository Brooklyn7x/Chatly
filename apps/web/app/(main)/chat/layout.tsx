"use client";

import React from "react";
import ProtectedRoute from "@/components/chat/ProtectedRoute";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ProtectedRoute>{children}</ProtectedRoute>
    </>
  );
};

export default ChatLayout;
