import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useAuth = () => {
  const router = useRouter();
  const { isAuthenticated, user, login, logout, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading]);

  return {
    user,
    login,
    logout,
    isAuthenticated,
    isLoading,
  };
};

export default useAuth;
