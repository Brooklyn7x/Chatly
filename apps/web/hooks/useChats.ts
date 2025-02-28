import { chatApi } from "@/services/api/chat";
import { useChatStore } from "@/store/useChatStore";
import { ChatUpdatePayload } from "@/types/chat";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
export const useChats = () => {
  const { addChats, deleteChat, setActiveChat, updateChat } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setActiveChat(null);
    } catch (error) {
      throw new Error("Failed to delete chat. Please try again.");
    }
  };

  const updateChatInfo = async (
    chatId: string,
    updateData: ChatUpdatePayload
  ) => {
    try {
      setIsLoading(true);
      const { data } = await chatApi.updateChat(chatId, updateData);
      // console.log(data)
      // updateChat(chatId, data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Update failed";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createChat,
    deleteCht,
    updateChatInfo,
    isLoading,
    error,
  };
};

export const getChats = () => {
  const { setChats } = useChatStore();
  const { data, isLoading, error } = useSWR("chats", chatApi.getChats, {
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
