import { MessageApi } from "@/services/api/message";
import { useMessageStore } from "@/store/useMessageStore";
import { useEffect, useState } from "react";

export const useMessage = (chatId: string) => {
  const { messages, isLoading, error, setMessages, setLoading, setError } =
    useMessageStore();
  const [hasMessage, setHasMessage] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(false);
        const data = await MessageApi.getMessages(chatId);
        console.log(data, "message-list");
        setMessages(chatId, data.messages);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch messages"
        );
      } finally {
        setLoading(false);
      }
    };
    if (chatId) {
      fetchMessages();
    }
  }, []);

  return {
    messages: messages[chatId] || [],
    isLoading,
    error,
  };
};
