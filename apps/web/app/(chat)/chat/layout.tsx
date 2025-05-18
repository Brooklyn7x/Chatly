"use client";

import AuthProvider from "@/components/provider/AuthProvider";
import React from "react";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default ChatLayout;
