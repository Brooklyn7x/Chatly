import { socketService } from "@/services/socket/socketService";
import useAuthStore from "@/store/useAuthStore";
import { useMessageStore } from "@/store/useMessageStore";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const useChatSocket = (chatId: string) => {
  const { addMessage } = useMessageStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!chatId) return;
    socketService.joinChat(chatId);
    return () => {
      socketService.leaveChat(chatId);
    };
  }, [chatId]);

  const sendMessage = (content: string) => {
    const tempId = uuidv4();
    const messageData = {
      _id: tempId,
      senderId: user?._id,
      conversationId: chatId,
      content,
      type: "text",
      status: "sending",
      timestamp: new Date().toISOString(),
    };
    addMessage(messageData as any);
    socketService.sendMessage(chatId, content, tempId);
  };

  const markAsRead = (messageIds: string[]) => {
    socketService.markMessageAsRead(chatId, messageIds);
  };

  return {
    sendMessage,
    markAsRead,
  };
};
