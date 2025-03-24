import { useEffect } from "react";
import { socketService } from "@/services/socket/socketService";

export function useChatSocket(chatId: string) {
  useEffect(() => {
    if (!chatId) return;
    socketService.joinChat(chatId);
    return () => {
      socketService.leaveChat(chatId);
    };
  }, [chatId]);
}
