import { useSocketStore } from "@/store/useSocketStore";
import { useCallback, useRef } from "react";

export const useTyping = (chatId?: string) => {
  const { socket } = useSocketStore();

  const timerRef = useRef<NodeJS.Timeout>();

  const startTyping = useCallback(() => {
    if (!chatId || !socket) return;

    socket.emit("typing_start", chatId);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      socket.emit("typing_stop", chatId);
    }, 2000);
  }, [chatId]);

  return {
    startTyping,
  };
};
