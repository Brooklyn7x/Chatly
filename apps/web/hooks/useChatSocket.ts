import { socketService } from "@/services/socket/socketService";
import { useEffect } from "react";

export function useChatSocket(chatId: string) {
  useEffect(() => {
    socketService.joinChat(chatId);
    return () => {
      socketService.leaveChat(chatId);
    };
  }, [chatId]);
}
