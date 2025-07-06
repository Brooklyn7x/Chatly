import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuthStore from "@/store/useAuthStore";

/**
 * Hook for protecting routes that require authentication
 */
export const useAuthGuard = (redirectTo: string = "/login") => {
  const { isAuthenticated, isLoading, isInitialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isLoading && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, isInitialized, router, redirectTo]);

  return {
    isAuthenticated,
    isLoading: isLoading || !isInitialized,
    canRender: isInitialized && isAuthenticated,
  };
};

/**
 * Hook for redirecting authenticated users away from auth pages
 */
export const useGuestGuard = (redirectTo: string = "/chat") => {
  const { isAuthenticated, isLoading, isInitialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isLoading && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, isInitialized, router, redirectTo]);

  return {
    isAuthenticated,
    isLoading: isLoading || !isInitialized,
    canRender: isInitialized && !isAuthenticated,
  };
};
