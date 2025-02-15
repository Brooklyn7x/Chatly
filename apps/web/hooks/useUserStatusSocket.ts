import { socketService } from "@/services/socket/socketService";
import { UserStatus, useUserStatusStore } from "@/store/useUserStatusStore";
import { useEffect } from "react";

export function useUserStatusSocket() {
  const updateStatus = useUserStatusStore((state) => state.updateStatus);

  useEffect(() => {
    const handleStatusChange = (data: {
      userId: string;
      status: string;
      lastSeen: Date;
    }) => {
      updateStatus({
        userId: data.userId,
        status: data.status as UserStatus,
        lastSeen: data.lastSeen,
      });
    };

    socketService.on("user:status_change", handleStatusChange);

    return () => {
      socketService.off("user:status_change", handleStatusChange);
    };
  }, [updateStatus]);
}
