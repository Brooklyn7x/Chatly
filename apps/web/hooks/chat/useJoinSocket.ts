import { useEffect } from "react";
import { useSocketStore } from "@/store/useSocketStore";

export function useJoinChatSocket(chatId: string) {
  const { isConnected, socket } = useSocketStore();

  useEffect(() => {
    if (!isConnected || !socket || !chatId) return;
    socket.emit("chat_join", chatId);
    return () => {
      socket.emit("chat_left", chatId);
    };
  }, [chatId]);
}
