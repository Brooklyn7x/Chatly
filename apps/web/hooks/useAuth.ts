import useAuthStore from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useAuth = () => {
  const router = useRouter();
  const { isAuthenticated, user, login, logout, error, isLoading } =
    useAuthStore();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, error]);

  return {
    isAuthenticated,
    user,
    login,
    logout,
    error,
    isLoading,
  };
};

export default useAuth;
