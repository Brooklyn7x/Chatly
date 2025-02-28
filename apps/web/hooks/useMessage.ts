import { MessageApi } from "@/services/api/message";
import { socketService } from "@/services/socket/socketService";
import useAuthStore from "@/store/useAuthStore";
import { useMessageStore } from "@/store/useMessageStore";
import useSWR from "swr";
import { MessageType } from "@/types/message";

export const useMessage = (chatId: string) => {
  const { addMessage } = useMessageStore();
  const { user } = useAuthStore();

  const sendMessage = (content: { attachments: string[]; message: string }) => {
    const tempId = `temp-${Date.now()}`;
    const contentType =
      content.attachments.length > 0 ? MessageType.IMAGE : MessageType.TEXT;

    const messageData = {
      _id: tempId,
      tempId,
      conversationId: chatId,
      senderId: user?._id as any,
      content: content.message,
      type: contentType,
      status: "sending",
      timestamp: new Date().toISOString(),
      attachments: content.attachments.map((url) => ({
        url,
        type: contentType,
      })),
    };

    addMessage(messageData);

    // const socketData: MessageData = {
    //   conversationId: chatId,
    //   content: content.message,
    //   type: contentType,
    //   attachments: messageData.attachments,
    //   tempId,
    //   recipientId: recipient?.userId._id,
    // };

    socketService.sendMessage(messageData);
  };

  const markAsRead = (messageIds: string[]) => {
    socketService.markMessageAsRead(messageIds, chatId);
  };

  return {
    sendMessage,
    markAsRead,
  };
};

export const getMessages = (id: string) => {
  const { setMessages } = useMessageStore();
  const { data, isLoading, error } = useSWR(
    `/messages/${id}`,
    () => MessageApi.getMessages(id),
    {
      onSuccess: (response) => {
        setMessages(id, response?.data);
      },
    }
  );
  return { messages: data?.data || [], isLoading, error };
};
