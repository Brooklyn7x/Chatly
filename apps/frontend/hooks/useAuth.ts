import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import socketService from "@/services/socket";
import useUserStatusStore from "@/store/useStatusStore";

const useAuth = () => {
  const router = useRouter();
  const { isAuthenticated, user, login, logout, isLoading, accessToken } =
    useAuthStore();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login");
    }

    if (isAuthenticated && accessToken) {
      socketService.connect(accessToken);
      useUserStatusStore.getState().setUserStatus(user?._id || "", "online");
    }

    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated, isLoading, accessToken]);

  useEffect(() => {
    const handleStatusChange = (data: { userId: string; status: string }) => {
      useUserStatusStore.getState().setUserStatus(data.userId, data.status);
    };

    const unsubscribeUserStatus =
      socketService.onUserStatusChange(handleStatusChange);

    return () => {
      unsubscribeUserStatus();
    };
  }, []);

  return {
    user,
    login,
    logout,
    isAuthenticated,
    isLoading,
  };
};

export default useAuth;
