import { chatApi } from "@/services/api/chat";
import { useChatStore } from "@/store/useChatStore";
import { useState, useCallback } from "react";

export const useChats = () => {
  const { setChats, addChats } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await chatApi.getChats();
      setChats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch chats");
    } finally {
      setIsLoading(false);
    }
  }, [setChats]);

  const createChat = async (participantIds: any[], title?: string) => {
    try {
      setIsLoading(true);
      const payload = {
        type: participantIds.length > 1 ? "group" : "direct",
        participantIds: participantIds,
        metadata: {
          title: participantIds.length > 1 ? title : null,
          description:
            participantIds.length > 1
              ? "Group conversation"
              : "Private conversation",
          avatar: null,
          isArchived: false,
          isPinned: false,
        },
      };
      const { data } = await chatApi.createChat(payload);
      console.log(data, "chat-data");
      addChats(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create chat"
      );
    } finally {
      setIsLoading(false);
    }
  };

  

  return {
    fetchChats,
    createChat,
    isLoading,
    error,
  };
};
