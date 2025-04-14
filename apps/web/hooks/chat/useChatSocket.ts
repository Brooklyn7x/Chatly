import { useEffect } from "react";
import { useSocketStore } from "@/store/useSocketStore";
import { useChatStore } from "@/store/useChatStore";
import { Chat } from "@/types";

export const useConversationSocket = () => {
  const { socket, isConnected } = useSocketStore();
  const addChats = useChatStore((state) => state.addChats);
  const addNewChat = useChatStore((state) => state.addNewChat);
  const updateChat = useChatStore((state) => state.updateChat);
  const deleteChat = useChatStore((state) => state.deleteChat);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewConversation = (data: { message: string; data: Chat }) => {
      addNewChat(data.data);
    };

    const handleUpdatedConversation = (data: {
      message: string;
      data: Chat;
    }) => {
      updateChat(data.data._id, data.data);
    };

    const handleDeletedConversation = (data: {
      message: string;
      conversationId: string;
    }) => {
      deleteChat(data.conversationId);
    };

    socket.on("conversation:new", handleNewConversation);
    socket.on("conversation:updated", handleUpdatedConversation);
    socket.on("conversation:deleted", handleDeletedConversation);

    return () => {
      socket.off("conversation:new", handleNewConversation);
      socket.off("conversation:updated", handleUpdatedConversation);
      socket.off("conversation:deleted", handleDeletedConversation);
    };
  }, [socket, isConnected, addChats, updateChat, deleteChat]);
};
