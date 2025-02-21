import { useCallback, useEffect, useRef, useState } from "react";
import { socketService } from "@/services/socket/socketService";
import useAuthStore from "@/store/useAuthStore";

export function useTypingIndicator(chatId: string) {
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuthStore();
  const timerRef = useRef<NodeJS.Timeout>();
  const userId = user?._id || "";

  const handleTypingStart = useCallback(() => {
    if (!chatId) return;
    socketService.sendTypingStart(chatId, userId);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      socketService.sendTypingStop(chatId, userId);
    }, 3000);
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;

    const handleStartTyping = (data: {
      conversationId: string;
      userIds: [];
    }) => {
      if (data.conversationId === chatId) {
        console.log(data.conversationId, chatId, "adas");
        setTypingUsers((prev) => {
          const next = new Set(prev);
          data.userIds.forEach((userId) => next.add(userId));
          return next;
        });
        setIsTyping(true);
      }
    };

    const handleStopTyping = (data: {
      conversationId: string;
      userIds: [];
    }) => {
      if (data.conversationId === chatId) {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          data.userIds.forEach((userId) => next.delete(userId));
          return next;
        });
        setIsTyping(false);
      }
    };

    socketService.on("typing:start", handleStartTyping);
    socketService.on("typing:stop", handleStopTyping);
    return () => {
      socketService.off("typing:start", handleStartTyping);
      socketService.off("typing:stop", handleStopTyping);
    };
  }, []);

  return {
    isTyping: typingUsers.size > 0,
    typingUsers: Array.from(typingUsers),
    handleTypingStart,
  };
}
