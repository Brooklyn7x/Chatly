import { useState } from "react";
import { toast } from "sonner";
import { resetAllStores } from "@/utils/store-reset";
import useAuthStore from "@/store/useAuthStore";
import { useSocketStore } from "@/store/useSocketStore";
import { useRouter } from "next/navigation";
import { loginUser, logoutUser, register } from "@/services/authService";
import { currentUser } from "@/services/userService";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const disconnect = useSocketStore((state) => state.disconnect);

  const me = async () => {
    setIsLoading(true);
    try {
      const response = await currentUser();
      const user = response.data?.user || response.data;
      if (response.status === 200 && user) {
        setUser(user);
      }
    } catch (error) {
      toast.error("Unauthorized");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await logoutUser();
      disconnect();
      setUser(null);
      resetAllStores();
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (creadentials: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      const response = await loginUser(creadentials);
      if (response && response.success) {
        router.push("/chat");
      }
    } catch (error: any) {
      toast.error(error.response?.data.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (creadentials: {
    email: string;
    username: string;
    password: string;
  }) => {
    try {
      setIsLoading(true);
      const resposne = await register(creadentials);
      if (resposne && resposne.success) {
        router.push("/chat");
      }
    } catch (error: any) {
      toast.error(error.response?.data.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    me,
    logout,
    login,
    register: registerUser,
    isLoading,
  };
}
