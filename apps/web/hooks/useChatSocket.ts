import { useMessageStore } from "@/store/useMessageStore";
import { useEffect } from "react";
import { useSocketStore } from "@/store/useSocketStore";
import { Message } from "@/types";

export const useChatSocket = (chatId: string) => {
  const { addMessage, updateMessage, updateMessageStatus } = useMessageStore();
  const { isConnected, socket } = useSocketStore();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewMessage = (message: any) => {
      addMessage(message.message);
    };

    const handleMessageSent = (response: {
      tempId: string;
      message: Message;
    }) => {
      const { tempId, message } = response;
      if (tempId) {
        updateMessage(response.tempId, message);
      }
    };

    const handleMessageEdited = (data: {
      conversationId: string;
      message: Message;
      timestamp: string;
    }) => {
      const { message } = data;
      updateMessage(message.conversationId, message);
    };

    const handleMessageDeleted = (data: {
      conversationId: string;
      messageId: string;
      timestamp: string;
    }) => {
      const { messageId, timestamp } = data;
      updateMessageStatus(messageId, {
        isDeleted: true,
        deletedAt: new Date(timestamp),
        content: "[Message deleted]",
        attachments: [],
        updatedAt: new Date().toISOString(),
      });
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("message:sent", handleMessageSent);
    socket.on("messageEdited", handleMessageEdited);
    socket.on("messageDeleted", handleMessageDeleted);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("message:sent", handleMessageSent);
      socket.off("messageEdited", handleMessageEdited);
      socket.off("messageDeleted", handleMessageDeleted);
    };
  }, [
    socket,
    isConnected,
    chatId,
    addMessage,
    updateMessage,
    updateMessageStatus,
  ]);
};
