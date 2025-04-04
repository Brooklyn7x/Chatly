// components/chat/ProtectedRoute.tsx
"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, hasCheckedAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (hasCheckedAuth && !isAuthenticated) {
      router.push("/login");
    }
  }, [hasCheckedAuth, isLoading, isAuthenticated, router]);

  if (!hasCheckedAuth || isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
