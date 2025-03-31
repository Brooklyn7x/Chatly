import { useSocketStore } from "@/store/useSocketStore";
import { useEffect, useState } from "react";

export function useTypingIndicator(chatId: string) {
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const { socket } = useSocketStore();
  useEffect(() => {
    if (!chatId || !socket) return;

    const handleStartTyping = (data: { chatId: string; userId: string }) => {
      if (data.chatId === chatId) {
        setTypingUsers((prev) => new Set(prev).add(data.userId));
      }
    };

    const handleStopTyping = (data: { chatId: string; userId: string }) => {
      if (data.chatId === chatId) {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          next.delete(data.userId);
          return next;
        });
      }
    };

    socket.on("typing_start", handleStartTyping);
    socket.on("typing_stop", handleStopTyping);
    return () => {
      socket.off("typing_start", handleStartTyping);
      socket.off("typing_stop", handleStopTyping);
    };
  }, [chatId]);

  return {
    isTyping: typingUsers.size > 0,
    typingUsers: Array.from(typingUsers),
  };
}
