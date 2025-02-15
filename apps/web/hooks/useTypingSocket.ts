import { useEffect } from "react";
import { socketService } from "@/services/socket/socketService";
import { useTypingStore } from "@/store/useTypingStore";

export function useTypingSocket() {
  const setTypingUsers = useTypingStore((state) => state.setTypingUsers);

  useEffect(() => {
    const handleTypingUpdate = (data: {
      conversationId: string;
      userIds: string[];
    }) => {
      console.log("Received typing update:", data);
      setTypingUsers(data.conversationId, data.userIds);
    };

    socketService.on("typing:update", handleTypingUpdate);
    return () => {
      socketService.off("typing:update", handleTypingUpdate);
    };
  }, [setTypingUsers]);
}
