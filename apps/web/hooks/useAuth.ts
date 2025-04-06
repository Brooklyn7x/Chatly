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

  const { disconnect } = useSocketStore();
  const router = useRouter();

  useEffect(() => {

    const verifyAuth = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get("/user/me", {});
        const user = response.data?.user || response.data;
        if (response.status === 200 && user) {
          useAuthStore.getState().setUser(user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    verifyAuth();
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
    isAuthenticated,
    logout,
  };
}
