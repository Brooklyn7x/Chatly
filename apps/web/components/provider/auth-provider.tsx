"use client";

import useAuthStore from "@/store/useAuthStore";
import { useEffect } from "react";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    useAuthStore.getState().fetchUser();
  }, []);

  return <>{children}</>;
}
