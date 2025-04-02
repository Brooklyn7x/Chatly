import { getMessages } from "@/services/messageService";
import { useMessageStore } from "@/store/useMessageStore";
import { useSocketStore } from "@/store/useSocketStore";
import useSWRInfinite from "swr/infinite";

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
