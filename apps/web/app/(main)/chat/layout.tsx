"use client";

import React from "react";

import AuthInitializer from "@/components/provider/auth-provider";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AuthInitializer>{children}</AuthInitializer>
    </>
  );
};

export default ChatLayout;
