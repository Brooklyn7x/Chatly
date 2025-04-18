import { getMessages } from "@/services/messageService";
import { useMessageStore } from "@/store/useMessageStore";
import { useSocketStore } from "@/store/useSocketStore";
import useSWRInfinite from "swr/infinite";
import { Message } from "@/types";
import useAuthStore from "@/store/useAuthStore";

export const useMessage = () => {
  const { addMessage } = useMessageStore();
  const { socket } = useSocketStore();
  const { user } = useAuthStore();
  const userId = user?.id;
  const updateMessage = useMessageStore((store) => store.updateMessage);

  const sendMessage = (
    chatId: string,
    content: { attachments: string[]; message: string }
  ) => {
    const tempId = `temp-${Date.now()}`;
    const contentType = content.attachments.length > 0 ? "image" : "text";
    const messageData = {
      _id: tempId,
      tempId,
      conversationId: chatId,
      senderId: {
        id: userId,
        _id: userId,
      },
      content: content.message,
      type: contentType,
      status: "sent",
      updatedAt: new Date().toISOString(),
      attachments: content.attachments.map((url) => ({
        url,
        type: contentType,
      })),
    };

    addMessage(messageData as any);
    socket?.emit("message_sent", messageData);
  };

  const editMessage = (data: {
    message: Message;
    conversationId: string;
    messageId: string;
    content: string;
  }) => {
    if (!socket) return;
    const { conversationId, messageId, content, message } = data;
    updateMessage(conversationId, {
      ...message,
      content,
      isEdited: true,
    });
    socket?.emit("message_edit", { messageId, content });
  };

  const deleteMessage = (messageId: string, message: Message) => {
    if (!socket) return;

    updateMessage(message.conversationId, {
      ...message,
      isDeleted: true,
    });

    socket?.emit("message_delete", messageId);
  };

  const markAsRead = (data: { chatId: string; messageId: string }) => {
    socket?.emit("mark_as_read", data);
  };

  const markAllRead = (data: { chatId: string }) => {
    socket?.emit("mark_all_read", data);
  };

  return {
    sendMessage,
    markAsRead,
    markAllRead,
    editMessage,
    deleteMessage,
  };
};

export const useFetchMessages = (chatId: string, limit: number = 10) => {
  const { setMessages } = useMessageStore();

  const { data, error, isLoading, isValidating, size, setSize } =
    useSWRInfinite(
      (pageIndex, previousPageData) => {
        if (pageIndex !== 0 && !previousPageData?.pagination?.nextCursor) {
          return null;
        }
        const cursor =
          pageIndex === 0 ? null : previousPageData.pagination.nextCursor;
        return [`/messages/${chatId}`, cursor, limit];
      },

      async (key) => {
        const [, cursor, limit] = key as [string, string | null, number];
        return await getMessages(chatId, cursor, limit);
      },
      {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        dedupingInterval: Infinity,
        onSuccess: (fetchedPages) => {
          const allMessages = fetchedPages
            .flatMap((page) => page.messages)
            .reverse();
          setMessages(chatId, allMessages);
        },
      }
    );

  const loadMore = () => {
    if (data && data[data.length - 1].pagination?.nextCursor) {
      setSize(size + 1);
    }
  };

  const hasMore = data
    ? data[data.length - 1].pagination?.nextCursor !== null
    : false;

  return {
    isLoading: isLoading || isValidating,
    error,
    messages: data ? data.flatMap((page) => page.messages) : [],
    loadMore,
    hasMore,
  };
};
