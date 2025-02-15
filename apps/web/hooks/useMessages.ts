import { MessageApi } from "@/services/api/message";
import useAuthStore from "@/store/useAuthStore";
import { useMessageStore } from "@/store/useMessageStore";
import { useEffect, useState } from "react";

export const useMessages = (chatId: string) => {
  const { messages, setMessages, addMessage, updateMessage, deleteMessage } =
    useMessageStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  // const [hasMessage, setHasMessage] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return;
      try {
        setIsLoading(true);
        const response = await MessageApi.getMessages(chatId);
        setMessages(chatId, response.data);
      } catch (err: any) {
        setError(err.message);
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [chatId]);

  // const sendMessage = async (content: string) => {
  //   const tempId = `temp-${Date.now()}`;
  //   const messageData = {
  //     _id: tempId,
  //     senderId: user?._id,
  //     conversationId: chatId,
  //     content,
  //     type: "text",
  //     status: "sending",
  //     timestamp: new Date().toISOString(),
  //   };
  //   addMessage(messageData as any);

  //   try {
  //     const response = await MessageApi.sendMessage(messageData);
  //     updateMessage(chatId, tempId, response.data);
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "Failed to send message");
  //     deleteMessage(chatId, tempId);
  //   }
  // };
  const deleteMsg = async (messageId: string) => {
    const message = messages[chatId]?.find((m) => m._id === messageId);
    if (!message) return;
    deleteMessage(chatId, messageId);

    try {
      await MessageApi.deleteMessage(messageId);
    } catch (error) {
      addMessage(message);
      throw error;
    }
  };

  const editMessage = async (messageId: string, newContent: string) => {
    const message = messages[chatId]?.find((m) => m._id === messageId);
    if (!message) return;

    const updatedMessage = { ...message, content: newContent, edited: true };
    updateMessage(chatId, messageId, updatedMessage);

    try {
      // await MessageApi.editMessage(messageId, { content: newContent });
    } catch (error) {
      updateMessage(chatId, messageId, message);
      throw error;
    }
  };

  const markAsRead = async (messageIds: string[]) => {
    try {
      // await MessageApi.markAsRead(messageIds);
      messageIds.forEach((id) => {
        const message = messages[chatId]?.find((m) => m._id === id);
        if (message) {
          updateMessage(chatId, id, { ...message, status: "read" });
        }
      });
    } catch (error) {
      setError("Failed to mark messages as read");
    }
  };

  const clearHistory = async () => {
    try {
      // await MessageApi.clearHistory(chatId);
      setMessages(chatId, []);
    } catch (error) {
      setError("Failed to clear chat history");
      throw error;
    }
  };

  const clearError = () => setError(null);

  return {
    deleteMsg,
    editMessage,
    markAsRead,
    clearHistory,
    clearError,
    messages: messages[chatId] || [],
    isLoading,
    error,
  };
};
