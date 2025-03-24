import { socketService } from "@/services/socket/socketService";
import { useEffect } from "react";
import { useSocket } from "./useSocket";

export function useChatSocket(chatId: string) {
  const { isConnected } = useSocket();

  useEffect(() => {
    if (!isConnected || !chatId) return;

    socketService.joinChat(chatId);
    return () => {
      socketService.leaveChat(chatId);
    };
  }, [chatId]);
}
