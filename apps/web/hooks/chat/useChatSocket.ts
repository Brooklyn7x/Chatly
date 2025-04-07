import { useEffect } from "react";
import { useSocketStore } from "@/store/useSocketStore";
import { useChatStore } from "@/store/useChatStore";
import { Chat } from "@/types";

export const useConversationSocket = () => {
  const { socket, isConnected } = useSocketStore();
  const addChats = useChatStore((state) => state.addChats);
  const updateChat = useChatStore((state) => state.updateChat);
  const deleteChat = useChatStore((state) => state.deleteChat);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewConversation = (data: { message: string; data: Chat }) => {
      console.log("[Socket] New conversation received:", data);
      addChats(data.data);
    };

    const handleUpdatedConversation = (data: {
      message: string;
      data: Chat;
    }) => {
      console.log("[Socket] Conversation updated:", data);
      updateChat(data.data._id, data.data);
    };

    // When a conversation is deleted, remove it from the store.
    const handleDeletedConversation = (data: {
      message: string;
      conversationId: string;
    }) => {
      console.log("[Socket] Conversation deleted:", data);
      deleteChat(data.conversationId);
    };

    socket.on("conversation:new", handleNewConversation);
    socket.on("conversation:updated", handleUpdatedConversation);
    socket.on("conversation:deleted", handleDeletedConversation);

    // Cleanup listeners on unmount
    return () => {
      socket.off("conversation:new", handleNewConversation);
      socket.off("conversation:updated", handleUpdatedConversation);
      socket.off("conversation:deleted", handleDeletedConversation);
    };
  }, [socket, isConnected, addChats, updateChat, deleteChat]);
};
