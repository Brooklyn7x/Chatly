import { useEffect, useRef } from "react";
import { useChatSocket } from "./useChatSocket";
import { Message } from "@/types/message";

export const useReadReceipts = (
  conversationId: string | null,
  messages: Message[],
  userId?: string
) => {
  const processedMessagesRef = useRef<Set<string>>(new Set());
  const { markAsRead } = useChatSocket(conversationId || "");
  const batchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      processedMessagesRef.current.clear();
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
    };
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId || !userId || !messages.length) return;

    const processMessages = () => {
      const unreadMessages = messages.filter(
        (message) =>
          message.senderId !== userId &&
          message.status !== "read" &&
          !processedMessagesRef.current.has(message._id)
      );

      if (unreadMessages.length > 0) {
        const messageIds = unreadMessages.map((msg) => msg._id);
        messageIds.forEach((id) => processedMessagesRef.current.add(id));
        markAsRead(messageIds);
      }
    };

    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
    }

    batchTimeoutRef.current = setTimeout(processMessages, 300);

    return () => {
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
    };
  }, [conversationId, messages, userId, markAsRead]);
};
