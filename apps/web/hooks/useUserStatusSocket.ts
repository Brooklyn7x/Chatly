import { socketService } from "@/services/socket/socketService";
import { UserStatus, useUserStatusStore } from "@/store/useUserStatusStore";
import { useEffect } from "react";
import { useSocket } from "./useSocket";

export function useUserStatusSocket() {
  const updateStatus = useUserStatusStore((state) => state.updateStatus);
  const { isConnected } = useSocket();
  useEffect(() => {
    if (!isConnected) return;
    const handleStatusChange = (data: {
      status: string;
      userId: string;
      timestamp: Date;
    }) => {
      updateStatus({
        userId: data.userId,
        status: data.status as UserStatus,
        timestamp: data.timestamp
          ? data.timestamp.toString()
          : new Date().toISOString(),
      });
    };
    socketService.on("user:status_change", handleStatusChange);
    return () => {
      socketService.off("user:status_change", handleStatusChange);
    };
  }, [updateStatus, isConnected]);
}
