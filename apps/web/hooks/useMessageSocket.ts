import { useMessageStore } from "@/store/useMessageStore";
import { useEffect } from "react";
import { MessageResponse } from "@/types/message";
import { socketService } from "@/services/socket/socketService";

export const useMessageSocket = () => {
  const { addMessage, updateMessageStatus } = useMessageStore();

  useEffect(() => {
    const handleNewMessage = (message: any) => {
      const messageData = message?._doc ? message?._doc : message;
      addMessage(messageData);
    };

    const handleMessageSent = (response: MessageResponse) => {
      if (response.tempId) {
        updateMessageStatus(response.tempId, {
          _id: response.messageId,
          status: "sent",
          timestamp: response.timestamp,
        });
      }
    };

    const handleMessageDelivered = (data: { messageId: string }) => {
      console.log(data);
      updateMessageStatus(data.messageId, { status: "delivered" });
    };

    const handleMessageEdited = (data: any) => {
      const message = data.data._doc ? data.data._doc : data.data;
      const { _id: messageId, content, editedAt, previousContent } = message;
      updateMessageStatus(messageId, {
        content,
        edited: true,
        editedAt,
        previousContent,
        updatedAt: new Date().toISOString(),
      });
    };

    const handleMessageDeleted = (data: {
      conversationId: string;
      deletedAt: Date;
      messageId: string;
    }) => {
      const { messageId, deletedAt } = data;

      updateMessageStatus(messageId, {
        deleted: true,
        deletedAt,
        content: "[Message deleted]",
        attachments: [],
        updatedAt: new Date().toISOString(),
      });
    };

    const handleMessageReadAck = (data: {
      messageIds: string[];
      conversationId: string;
      timestamp: string;
    }) => {
      data.messageIds.forEach((messageId) => {
        updateMessageStatus(messageId, {
          status: "read",
        });
      });
    };

    socketService.on("message:new", handleNewMessage);
    socketService.on("message:sent", handleMessageSent);
    socketService.on("message:edited", handleMessageEdited);
    socketService.on("message:deleted", handleMessageDeleted);
    socketService.on("message:delivered", handleMessageDelivered);
    socketService.on("message:read:ack", handleMessageReadAck);

    return () => {
      socketService.off("message:new", handleNewMessage);
      socketService.off("message:sent", handleMessageSent);
      socketService.off("message:delivered", handleMessageDelivered);
      socketService.off("message:read:ack", handleMessageReadAck);
      socketService.off("message:edited", handleMessageEdited);
      socketService.off("message:deleted", handleMessageDeleted);
    };
  }, [addMessage, updateMessageStatus]);

  return socketService;
};
