import { createChat, getAllChats } from "@/services/chatService";
import { useChatStore } from "@/store/useChatStore";
import { useState } from "react";
import useSWRInfinite from "swr/infinite";

export const useFetchChats = (limit: number = 10) => {
  const { setChats } = useChatStore();

  const { data, error, isLoading, isValidating, size, setSize } =
    useSWRInfinite(
      (pageIndex, previousPageData) => {
        if (pageIndex !== 0 && !previousPageData?.pagination?.nextCursor) {
          return null;
        }
        const cursor =
          pageIndex === 0 ? null : previousPageData.pagination.nextCursor;

        return ["chats", cursor, limit];
      },

      async (key) => {
        const [, cursor, limit] = key as [string, string | null, number];
        const response = await getAllChats(cursor, limit);
        return {
          chats: response.data,
          pagination: response.pagination,
        };
      },
      {
        onSuccess: (fetchedPages) => {
          const allChats = fetchedPages.flatMap((page) => page.chats);
          setChats(allChats);
        },
        revalidateIfStale: false,
        revalidateOnFocus: false,
      }
    );
  const loadMore = () => {
    if (
      data &&
      data.length > 0 &&
      data[data.length - 1]?.pagination?.nextCursor
    ) {
      setSize(size + 1);
    }
  };

  const hasMore = data
    ? data[data.length - 1]?.pagination?.nextCursor !== null
    : false;

  return {
    isLoading: isLoading || isValidating,
    error,
    loadMore,
    hasMore,
    chats: data ? data.flatMap((page) => page.chats) : [],
    currentPage: size,
  };
};

export const useCreateChat = () => {
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createChatRoom = async (
    type: string,
    participants: any,
    name?: string,
    description?: string
  ) => {
    try {
      setIsMutating(true);
      const response = await createChat({
        type,
        name,
        description,
        participants,
      });
      return response.data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Create chat failed";
      setError(message);
      throw error;
    } finally {
      setIsMutating(false);
    }
  };
  return {
    createChatRoom,
    isMutating,
    error,
  };
};

export const useDeleteChat = () => {};
export const useUpdateChat = () => {};
