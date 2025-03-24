import { MessageApi } from "@/services/api/message";
import { useMessageStore } from "@/store/useMessageStore";
import { MessageStatus, MessageType } from "@/types/message";
import { socketService } from "@/services/socket/socketService";
import { useState, useEffect } from "react";
import useSWR from "swr";

const PAGE_SIZE = 20;

// export const fetchMessages = (id: string) => {
//   const { setMessages, addMessage } = useMessageStore();

//   const getKey = (pageIndex: number, previousPageData: any) => {
//     if (!id) return null;
//     if (previousPageData && !previousPageData.length) return null;

//     const beforeDate =
//       previousPageData?.[previousPageData.length - 1]?.createdAt;

//     return {
//       url: `/messages/${id}`,
//       params: {
//         limit: PAGE_SIZE,
//         before: beforeDate,
//       },
//     };
//   };

//   const { data, error, isLoading, size, setSize } = useSWRInfinite(
//     getKey,
//     async ({ url, params }) => {
//       const response = await MessageApi.getMessages(url, params);
//       if (size === 0) {
//         setMessages(id, response.data);
//       } else {
//         // addMessage(id, response.data);
//         console.log(response.data);
//       }
//       return response.data;
//     },
//     {
//       revalidateFirstPage: false,
//     }
//   );

//   const messages = data ? [].concat(...data) : [];
//   const isLoadingMore =
//     isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
//   const isEmpty = data?.[0]?.length === 0;
//   const isReachingEnd =
//     isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);

//   const loadMore = () => {
//     if (!isLoadingMore && !isReachingEnd) {
//       setSize(size + 1);
//     }
//   };

//   return {
//     messages,
//     isLoading,
//     isLoadingMore,
//     isReachingEnd,
//     error,
//     hashMore,
//     loadMore,
//   };
// };

export const useMessage = (chatId: string, userId: string) => {
  const { addMessage } = useMessageStore();

  const sendMessage = (content: { attachments: string[]; message: string }) => {
    if (!chatId || !userId) return;

    const tempId = `temp-${Date.now()}`;
    const contentType =
      content.attachments.length > 0 ? MessageType.IMAGE : MessageType.TEXT;

    const messageData = {
      _id: tempId,
      tempId,
      conversationId: chatId,
      senderId: userId,
      content: content.message,
      type: contentType,
      status: MessageStatus.SENT,
      timestamp: new Date().toISOString(),
      attachments: content.attachments.map((url) => ({
        url,
        type: contentType,
      })),
    };

    addMessage(messageData as any);
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

export const fetchMessages = (id: string) => {
  const { setMessages, addMessage } = useMessageStore();
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data, isLoading, error } = useSWR(
    `/api/messages/${id}${cursor ? `&before=${cursor}` : ""}`,
    () => MessageApi.getMessages(id, { before: cursor || "" }),
    {
      onSuccess: (response) => {
        if (!cursor) {
          setMessages(id, response?.data);
        } else {
          // addMessages(id, response?.messages);
        }
        setHasMore(response?.hasMore);
        setCursor(response?.cursor);
      },
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const loadMore = async () => {
    if (!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const response = await MessageApi.getMessages(id, {
        before: cursor || "",
      });
      if (response?.messages?.length > 0) {
        // addMessages(id, response.messages);
        setHasMore(response.hasMore);
        setCursor(response.cursor);
      }
    } finally {
      setIsLoadingMore(false);
    }
  };

  return {
    messages: data?.messages || [],
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
  };
};
