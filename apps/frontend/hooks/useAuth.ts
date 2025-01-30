import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import socketService from "@/services/socket/socket";
import useUserStatusStore from "@/store/useStatusStore";

export const useAuth = () => {
  const router = useRouter();
  const { user, isAuthenticated, error, login, logout, token } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }

    if (isAuthenticated && token) {
      socketService.connect(token);
      useUserStatusStore.getState().setUserStatus(user?._id || "", "online");
    }

    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated, token]);

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
  };
};
