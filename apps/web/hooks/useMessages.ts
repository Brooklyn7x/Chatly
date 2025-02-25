import { MessageApi } from "@/services/api/message";
import { useMessageStore } from "@/store/useMessageStore";
import { useEffect, useState } from "react";
import useSWR from "swr";

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

export const getMessages = (id: string) => {
  const { setMessages } = useMessageStore();
  const { data, isLoading, error } = useSWR(
    `/api/messages/${id}`,
    () => MessageApi.getMessages(id),
    {
      onSuccess: (response) => {
        setMessages(id, response?.data);
      },
    }
  );
  return { messages: data?.data || [], isLoading, error };
};
