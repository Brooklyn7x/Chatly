import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiClient } from "@/services/apiClient";
import { resetAllStores } from "@/utils/store-reset";
import useAuthStore from "@/store/useAuthStore";
import { useSocketStore } from "@/store/useSocketStore";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const { disconnect } = useSocketStore();
  const router = useRouter();
  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get("/user/me", {
          withCredentials: true,
        });
        const user = response.data?.user || response.data;

        if (response.status === 200 && user) {
          if (isMounted) {
            useAuthStore.getState().setUser(user);
            setIsAuthenticated(true);
          }
        } else {
          if (isMounted) {
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        if (isMounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setHasCheckedAuth(true);
        }
      }
    };
    verifyAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
      disconnect();
      setIsAuthenticated(false);
      resetAllStores();
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return {
    isLoading,
    hasCheckedAuth,
    isAuthenticated,
    logout,
  };
}
