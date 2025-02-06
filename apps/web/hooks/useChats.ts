import { chatApi } from "@/services/api/chat";
import { socketService } from "@/services/socket/socketService";
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
        setChats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch chats");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const createChat = async (participantIds: string[]) => {
    try {
      const tempId = new Date();
      const payload = {
        tempId,
        type: "direct",
        participantIds: participantIds,
        metadata: {
          title: "",
          description: "Direct conversation",
          avatar: "/user.png",
          isArchived: false,
          isPinned: false,
        },
      };
      // addChats(payload);
      console.log(payload, "new chat payload");
      socketService.chatCreate(payload);
    } catch (err) {
      console.error(err);
    }
  };

  // const deleteChat = async (chatId: string) => {
  //   try {
  //     setLoading(true);
  //     const { data } = await chatApi.deleteChat(chatId);
  //     console.log(data, "delete-chat-data");
  //     if (data.success) {
  //       deleteChat(chatId);
  //     }
  //   } catch (error) {
  //     setError(
  //       error instanceof Error ? error.message : "Failed to delete chat"
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const deleteChat = (chatId: string) => {
    try {
      socketService.chatDelete(chatId);
    } catch (error) {
      console.error(error);
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
function uuidv4(): any {
  throw new Error("Function not implemented.");
}
