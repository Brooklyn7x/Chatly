import { socketService } from "@/services/socket/socketService";
import useAuthStore from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { useMessageStore } from "@/store/useMessageStore";

export const useMessage = (chatId: string) => {
  const { addMessage } = useMessageStore();
  const { user } = useAuthStore();
  const { chats } = useChatStore();
  const currentChat = chats.find((chat) => chat._id === chatId);
  const recipient = currentChat?.participants.find(
    (participant) => participant.userId._id !== user?._id
  );

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

    socketService.sendMessage(chatId, content, tempId, recipient?.userId._id);
  };

  const markAsRead = (messageIds: string[]) => {
    socketService.markMessageAsRead(messageIds, chatId);
  };

  return {
    sendMessage,
    markAsRead,
  };
};
