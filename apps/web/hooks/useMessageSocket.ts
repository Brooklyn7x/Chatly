import { useMessageStore } from "@/store/useMessageStore";
import { useEffect } from "react";
import { MessageResponse } from "@/types/message";
import { socketService } from "@/services/socket/socketService";

export const useMessageSocket = () => {
  const { addMessage, updateMessageStatus } = useMessageStore();

  useEffect(() => {
    const handleNewMessage = (message: any) => {
      const messageData = message._doc ? message._doc : message;
      addMessage({
        ...messageData,
        _id: messageData._id || `temp-${Date.now()}`,
        status: "sent",
      });
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
    };
  }, [addMessage, updateMessageStatus]);

  return socketService;
};
