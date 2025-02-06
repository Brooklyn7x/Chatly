import { socketService } from "@/services/socket/socketService";
import { useEffect } from "react";

export function useChatSocket() {
  useEffect(() => {
    const handleNewChat = () => {};
    const handleChatError = () => {};
    const handleDeleteChat = () => {};

    socketService.on("chat:new", handleNewChat);
    socketService.on("chat:delete", handleDeleteChat);
    socketService.on("chat:error", handleChatError);

    return () => {
      socketService.on("chat:new", handleNewChat);
      socketService.on("chat:error", handleChatError);
      socketService.on("chat:delete", handleDeleteChat);
    };
  }, []);
}
