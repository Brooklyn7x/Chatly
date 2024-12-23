import useAuthStore from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useAuth = () => {
  const router = useRouter();
  const { isAuthenticated, user, login, logout, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading]);

  return {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated,
  };
};

export default useAuth;
