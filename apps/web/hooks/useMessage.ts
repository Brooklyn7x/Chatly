import { getMessages } from "@/services/messageService";
import { useMessageStore } from "@/store/useMessageStore";
import { useSocketStore } from "@/store/useSocketStore";
import { useState } from "react";
import useSWR from "swr";

export const useMessage = (chatId: string, userId: string) => {
  const { addMessage } = useMessageStore();
  const { socket } = useSocketStore();

  const sendMessage = (content: { attachments: string[]; message: string }) => {
    if (!chatId || !socket) return;

    const tempId = `temp-${Date.now()}`;
    const contentType = content.attachments.length > 0 ? "image" : "text";

    const messageData = {
      _id: tempId,
      tempId,
      conversationId: chatId,
      senderId: userId,
      content: content.message,
      type: contentType,
      status: "sent",
      timestamp: new Date().toISOString(),
      attachments: content.attachments.map((url) => ({
        url,
        type: contentType,
      })),
    };

    addMessage(messageData as any);
    socket.emit("sendMessage", messageData);
  };

  const markAsRead = (messageIds: string[]) => {
    // socket("markAsRead" ,messageIds, chatId);
  };

  const markAllRead = () => {};

  return {
    sendMessage,
    markAsRead,
    markAllRead,
  };
};

export const useFetchMessages = (chatId: string) => {
  const { setMessages, addMessage } = useMessageStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data, isLoading, error } = useSWR(
    `/api/messages/${chatId}?page=${currentPage}`,
    () => getMessages(chatId),
    {
      onSuccess: (response) => {
        setMessages(chatId, response.data.messages);
      },
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    isLoading,
    error,
    messages: data?.data.messages,
  };
};
