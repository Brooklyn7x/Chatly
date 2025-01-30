import { chatApi } from "@/services/api/chat";
import { useChatStore } from "@/store/useChatStore";
import { useEffect } from "react";

export const useChats = () => {
  const { chats, isLoading, error, setChats, addChats, setLoading, setError } =
    useChatStore();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(false);
        const { data } = await chatApi.getChats();
        console.log(data, "chat-data");
        setChats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch chats");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const createChat = async (participantIds: any) => {
    try {
      setLoading(true);
      const payload = {
        type: participantIds.length > 1 ? "group" : "direct",
        participantIds: participantIds,
        metadata: {
          title: participantIds.length > 1 ? "" : null,
          description:
            participantIds.length > 1
              ? "Group conversation"
              : "Direct conversation",
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
      setLoading(false);
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      setLoading(true);
      const { data } = await chatApi.deleteChat(chatId);
      console.log(data, "delete-chat-data");
      if (data.success) {
        deleteChat(chatId);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete chat"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    chats,
    createChat,
    deleteChat,
    isLoading,
    error,
  };
};
