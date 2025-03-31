import { useSocketStore } from "@/store/useSocketStore";
import useUserStatusStore from "@/store/useUserStatusStore";
import { useEffect } from "react";

export function useUserStatusSocket() {
  const { isConnected, socket } = useSocketStore();
  const { updateUserStatus } = useUserStatusStore();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleStatusChange = (data: { userId: string; status: string }) => {
      const { userId, status } = data;
      updateUserStatus(userId, status);
      console.log(`User ${userId} is now ${status}`);
    };

    socket.on("user_status_changes", handleStatusChange);
    return () => {
      socket.off("user_status_changes", handleStatusChange);
    };
  }, [socket]);
}
