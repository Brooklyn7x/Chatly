import { useCallback, useEffect, useRef, useState } from "react";
import socketService from "@/services/socket";

interface TypingData {
  userId: string;
}
import { Chat } from "@/store/useChatStore";

export function useTypingIndicator(
  currentChat: Chat | null,
  userId: string | null
) {
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!currentChat || !userId) {
      return;
    }

    const handleTypingUpdate = (data: TypingData) => {
      if (
        data.userId !== userId &&
        currentChat.participants.some((p) => p.userId === data.userId)
      ) {
        setIsTyping(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    };

    const unsubscribe = socketService.onTypingUpdate(handleTypingUpdate);

    return () => {
      unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentChat, userId]);

  const handleTypingStart = useCallback(() => {
    if (!currentChat || !userId) return;

    const recipient = currentChat.participants.find((p) => p.userId !== userId);
    if (!recipient) return;

    socketService.startTyping(recipient.userId);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      socketService.startTyping(recipient.userId);
    }, 3000);
  }, [currentChat, userId]);

  return { isTyping, handleTypingStart };
}
