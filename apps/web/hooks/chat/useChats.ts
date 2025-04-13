import { getAllChats } from "@/services/chatService";
import { useChatStore } from "@/store/useChatStore";
import { useSocketStore } from "@/store/useSocketStore";
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

export const useChat = () => {
  const socket = useSocketStore((state) => state.socket);
  const deleteChat = (chatId: string) => {
    
  };
};
