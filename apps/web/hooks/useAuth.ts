import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiClient } from "@/services/apiClient";
import { resetAllStores } from "@/utils/store-reset";
import useAuthStore from "@/store/useAuthStore";
import { useSocketStore } from "@/store/useSocketStore";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { disconnect } = useSocketStore();

  const verifyAuth = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/auth/me", {
        withCredentials: true,
      });

      if (response.status === 404 || response.status === 401) {
        setIsAuthenticated(false);
        router.push("/login");
      } else if (response.status === 200) {
        const data = response.data.user;
        useAuthStore.getState().setUser(data);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push("/login");
      }
    } catch (error) {
      setIsAuthenticated(false);
      setIsLoading(false);
      toast.error("Authentication failed");
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyAuth();
  }, [router]);

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
      disconnect();
      router.push("/login");
      setIsAuthenticated(false);
      resetAllStores();
    } catch (error) {
      console.log(error);
      toast.error("Logout failed");
    }
  };

  return {
    isLoading,
    isAuthenticated,
    logout,
  };
}
