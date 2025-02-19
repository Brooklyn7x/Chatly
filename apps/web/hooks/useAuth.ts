import { useRouter } from "next/navigation";
import { useState } from "react";
import { authApi } from "@/services/api/auth";
import useAuthStore from "@/store/useAuthStore";
import { LoginInput, RegisterInput } from "@/types/auth";

export const useAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>("");
  const { login: setAuth, logout: clearAuth } = useAuthStore();

  const login = async (data: LoginInput) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.login(data);
      setAuth(response.accessToken, response.user);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred during login");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterInput) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.register(data);
      setAuth(response.accessToken, response.user);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred during registration");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      clearAuth();
      router.replace("/auth");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred during logout");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    register,
    logout,
    isLoading,
    error,
  };
};
