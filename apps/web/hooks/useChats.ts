import { chatApi } from "@/services/api/chat";
import { useChatStore } from "@/store/useChatStore";
import { ChatUpdatePayload } from "@/types/chat";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import useSWR from "swr";
export const useChats = () => {
  const { setChats, addChats, deleteChat } = useChatStore();
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
      addChats(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create chat"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCht = async (chatId: string) => {
    try {
      await chatApi.deleteChat(chatId);
      deleteChat(chatId);
    } catch (error) {
      throw new Error("Failed to delete chat. Please try again.");
    }
  };

  const updateCht = async (chatId: string, updateData: ChatUpdatePayload) => {
    try {
      setIsLoading(true);
      const { data } = await chatApi.updateChat(chatId, updateData);
      // updateChat(chatId, data);
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Update failed";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchChats,
    createChat,
    deleteCht,
    updateCht,
    isLoading,
    error,
  };
};

export const getChats = () => {
  const { setChats } = useChatStore();
  const { data, isLoading, error } = useSWR("/api/chats", chatApi.getChats, {
    onSuccess: (response) => {
      setChats(response.data);
    },
  });

  return {
    chats: data || [],
    isLoading,
    error,
  };
};
