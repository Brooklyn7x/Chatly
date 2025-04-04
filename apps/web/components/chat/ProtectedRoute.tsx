"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

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
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-8 w-3/4 rounded-lg" />
          <Skeleton className="h-8 w-1/2 rounded-lg" />
          <Skeleton className="h-8 w-3/4 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
