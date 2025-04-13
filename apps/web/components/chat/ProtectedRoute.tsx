"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { currentUser } from "@/services/userService";
import useAuthStore from "@/store/useAuthStore";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenicated, setIsAuthenicated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const verify = async () => {
      setIsLoading(true);
      try {
        const response = await currentUser();
        const user = response.data?.user || response.data;
        if (response.status === 200 && user) {
          setUser(user);
          setIsAuthenicated(true);
          router.push("/chat");
        } else {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    verify();
  }, [setUser, router]);

  if (isLoading || !isMounted) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh bg-background">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-8 w-3/4 rounded-lg" />
          <Skeleton className="h-8 w-1/2 rounded-lg" />
          <Skeleton className="h-8 w-3/4 rounded-lg" />
          <Skeleton className="h-8 w-3/4 rounded-lg" />
          <Skeleton className="h-8 w-1/2 rounded-lg" />
          <Skeleton className="h-8 w-3/4 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!isAuthenicated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
