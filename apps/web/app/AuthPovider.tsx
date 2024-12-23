"use client";

import { useEffect, useState } from "react";
import useAuthStore from "@/store/useUserStore";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { initialize } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      await initialize();
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthProvider;
