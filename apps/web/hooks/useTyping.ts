import { socketService } from "@/services/socket/socketService";
import { useTypingStore } from "@/store/useTypingStore";
import { useCallback, useMemo, useRef, useState } from "react";

export const useTyping = (userId: string, conversationId?: string) => {
  const [isTyping, setIsTyping] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  const startTyping = useCallback(() => {
    if (!conversationId) return;

    socketService.sendTypingStart(conversationId, userId);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      socketService.sendTypingStop(conversationId, userId);
    }, 2000);
  }, [conversationId]);

  // const typingUsers = useTypingStore((state) =>
  //   conversationId ? state.typingMap[conversationId] || [] : []
  // );

  // const typingText = useMemo(() => {
  //   if (!typingUsers?.length) return "";
  //   if (typingUsers.length === 1) return "is typing...";
  //   if (typingUsers.length <= 3) return "are typing...";
  //   return "Several people are typing...";
  // }, [typingUsers]);

  return {
    // typingUsers,
    // typingText,
    startTyping,
  };
};
