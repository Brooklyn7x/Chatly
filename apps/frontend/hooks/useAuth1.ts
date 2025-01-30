import { authApi } from "@/services/api/auth";
import useAuthStore from "@/store/useAuthStore";
import { LoginInput, RegisterInput } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: setAuth, logout: clearAuth } = useAuthStore();

  const login = async (data: LoginInput) => {
    try {
      setIsLoading(false);
      setError(null);
      const response = await authApi.login(data);
      setAuth(response.accessToken, response.user);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      throw err;
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
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      setIsLoading(true);
      clearAuth();
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logout failed");
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
