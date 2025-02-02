import { socketService } from "@/services/socket/socketService";
import { useMessageStore } from "@/store/useMessageStore";
import { useEffect } from "react";
import { Message, MessageResponse } from "@/types/message";

export const useSocket = () => {
  const { addMessage, updateMessageStatus, updateMessage } = useMessageStore();

  useEffect(() => {
    socketService.initialize();

    const handleNewMessage = (message: Message) => {
      addMessage(message);
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

    const handleMessageDelivered = (messageId: string) => {
      updateMessageStatus(messageId, { status: "delivered" });
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
    socketService.on("message:delivered", handleMessageDelivered);
    socketService.on("message:read:ack", handleMessageReadAck);

    return () => {
      socketService.off("message:new", handleNewMessage);
      socketService.off("message:sent", handleMessageSent);
      socketService.off("message:delivered", handleMessageDelivered);
      socketService.off("message:read:ack", handleMessageReadAck);
      socketService.disconnect();
    };
  }, [addMessage, updateMessageStatus]);

  return socketService;
};
