import { useTypingStore } from "@/store/useTypingStore";
import { useMemo } from "react";

export const useTypingIndicator = (conversationId?: string) => {
  const typingUsers = useTypingStore((state) =>
    conversationId ? state.typingMap[conversationId] || [] : []
  );

  const typingText = useMemo(() => {
    if (!typingUsers?.length) return "";
    if (typingUsers.length === 1) return "is typing...";
    if (typingUsers.length <= 3) return "are typing...";
    return "Several people are typing...";
  }, [typingUsers]);

  return {
    typingUsers,
    typingText,
  };
};
