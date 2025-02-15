import { socketService } from "@/services/socket/socketService";
import useAuthStore from "@/store/useAuthStore";
import { useMessageStore } from "@/store/useMessageStore";

export const useMessage = (chatId: string) => {
  const { addMessage } = useMessageStore();
  const { user } = useAuthStore();

  const sendMessage = (content: string) => {
    const tempId = `temp-${Date.now()}`;
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
