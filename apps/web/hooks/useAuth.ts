import { authApi } from "@/services/api/auth";
import useAuthStore from "@/store/useAuthStore";
import { LoginInput, RegisterInput } from "@/types/auth";
import { AuthError } from "@/utils/errors";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const router = useRouter();
  const {
    login: setAuth,
    logout: clearAuth,
    setLoading,
    setError,
  } = useAuthStore();

  const login = async (data: LoginInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.login(data);
      setAuth(response.accessToken, response.user.data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error("An unexpected error occurred during login"));
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.register(data);
      setAuth(response.accessToken, response.user);
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error("An unexpected error occurred during registration"));
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      // r
      clearAuth();
      router.replace("/auth");
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error("An unexpected error occurred during logout"));
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    register,
    logout,
  };
};
