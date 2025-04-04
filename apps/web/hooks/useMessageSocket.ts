import { useMessageStore } from "@/store/useMessageStore";
import { useEffect } from "react";
import { useSocketStore } from "@/store/useSocketStore";
import { Message } from "@/types";
import { toast } from "sonner";

export const useMessageSocket = () => {
  const { addMessage, updateMessage, updateMessageStatus } = useMessageStore();
  const { socket, isConnected } = useSocketStore();

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
      updateMessage(message.conversationId, message, tempId);
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

    const handleMessageError = (data: { message: string }) => {
      toast.error(data.message);
    };

    const handleMessageRead = (data: { messageId: string }) => {
      const { messageId } = data;
      updateMessageStatus(messageId, {
        status: "read",
      });
    };

    const handleMessageAllRead = () => {};

    socket.on("message_new", handleNewMessage);
    socket.on("message_ack", handleMessageSent);
    socket.on("message_edited", handleMessageEdited);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("message_read", handleMessageRead);
    socket.on("message_all_read", handleMessageAllRead);
    socket.on("message_error", handleMessageError);

    return () => {
      socket.off("message_new", handleNewMessage);
      socket.off("message_ack", handleMessageSent);
      socket.off("message_edited", handleMessageEdited);
      socket.off("message_deleted", handleMessageDeleted);
      socket.off("message_read", handleMessageRead);
      socket.off("message_all_read", handleMessageAllRead);
      socket.off("message_error", handleMessageError);
    };
  }, []);
};
