import socketService from "@/services/socket";
import { useMessageStore } from "@/store/useMessageStore";
import { User } from "@/types";
import { useEffect } from "react";

export const useSocketChat = (
  token: string,
  selectChatId: string | null,
  user: User | null
) => {
  const userId = user?._id;
  const { addMessage } = useMessageStore();
  const messageSet = new Set();

  useEffect(() => {
    if (!token || !selectChatId) {
      return;
    }

    socketService.connect(token);

    const unsubscribeMessage = socketService.onMessageReceived((message) => {
      const messageId = message._id;

      if (messageSet.has(messageId)) {
        return;
      }

      messageSet.add(messageId);

      const formattedMessage = {
        _id: message._id,
        conversationId: message._doc.conversationId,
        conversationType: message.conversationType,
        content: message._doc.content,
        type: message._doc.type,
        senderId: message._doc.senderId,
        receiverId: message._doc.receiverId,
        timestamp: new Date(message._doc.timestamp).toISOString(),
        sender: {
          userId: message._doc.senderId,
          timestamp: new Date().toISOString(),
        },
      };

      addMessage(formattedMessage);
    });

    return () => {
      unsubscribeMessage();
      socketService.disconnect();
    };
  }, [token, selectChatId, userId]);
};
