import { useCallback, useEffect, useRef, useState } from "react";
import { socketService } from "@/services/socket/socketService";

export function useTypingIndicator(chatId: string, userId: string) {
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const timerRef = useRef<NodeJS.Timeout>();

  const handleTypingStart = useCallback(() => {
    if (!chatId) return;

    socketService.sendTypingStart(chatId, userId);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      socketService.sendTypingStop(chatId, userId);
    }, 4000);
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;

    const handleStartTyping = (data: {
      userId: string;
      conversationId: string;
    }) => {
      if (data.conversationId === chatId) {
        setTypingUsers((prev) => new Set(prev).add(data.userId));
      }
    };

    const handleStopTyping = (data: {
      userId: string;
      conversationId: string;
    }) => {
      if (data.conversationId === chatId) {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          next.delete(data.userId);
          return next;
        });
      }
    };

    socketService.on("typing:start", handleStartTyping);
    socketService.on("typing:stop", handleStopTyping);

    return () => {
      socketService.off("typing:start", handleStartTyping);
      socketService.off("typing:stop", handleStopTyping);
    };
  });

  return {
    isTyping: typingUsers.size > 0,
    typingUsers: Array.from(typingUsers),
    handleTypingStart,
  };
}
