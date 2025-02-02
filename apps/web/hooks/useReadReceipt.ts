import { useEffect, useRef } from "react";
import { useSocketChat } from "./useSocketChat";
import { Message } from "@/types/message";

export const useReadReceipts = (
  conversationId: string | null,
  messages: Message[],
  userId?: string
) => {
  const processedMessagesRef = useRef<Set<string>>(new Set());
  const { markAsRead } = useSocketChat(conversationId || "");
  const batchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Clear processed messages when conversation changes
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

    // Batch process messages with a small delay
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
