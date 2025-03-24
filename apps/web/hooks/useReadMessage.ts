import useAuthStore from "@/store/useAuthStore";
import { useMessageStore } from "@/store/useMessageStore";
import { useEffect, useMemo } from "react";
import { useMessage } from "./useMessage";

export const useReadMessages = (chatId: string) => {
  const { user } = useAuthStore();
  const { messages } = useMessageStore();

  if (!chatId || !user) return;

  const { markAsRead } = useMessage(chatId, user?._id);

  const unReadMessages = useMemo(() => {
    return messages[chatId]?.filter(
      (message: any) =>
        message.status !== "read" &&
        message.senderId?._id !== user?._id &&
        !message._id.startsWith("temp-")
    );
  }, [messages, chatId, user?._id]);

  const messageIds = useMemo(() => {
    return unReadMessages?.map((message: any) => message._id) || [];
  }, [unReadMessages]);

  useEffect(() => {
    if (messageIds?.length > 0) {
      markAsRead(messageIds);
    }
  }, [messages, chatId, user._id]);
};
