"use client";

import React from "react";
import useAuth from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }
  return isAuthenticated ? <>{children}</> : null;
}
