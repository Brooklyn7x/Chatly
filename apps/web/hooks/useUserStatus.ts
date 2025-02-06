import { socketService } from "@/services/socket/socketService";
import useUserStatusStore from "@/store/useUserStatusStore";
import { useEffect } from "react";

export const useUserStatus = (userId: string) => {
  const { userStatus, setUserStatus } = useUserStatusStore();

  useEffect(() => {
    const handleStatus = (data: { userId: string; status: any }) => {
      setUserStatus(data.userId, data.status);
    };
    socketService.on("user:status", handleStatus);
    return () => {
      socketService.off("user:status", handleStatus);
    };
  }, []);

  return {
    isOnline: userId ? userStatus[userId] === "online" : false,
  };
};
