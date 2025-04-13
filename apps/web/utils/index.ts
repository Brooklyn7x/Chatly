import { Chat } from "@/types";

export const formatDate = (date: string | Date): string => {
  const messageDate = new Date(date);
  const now = new Date();
  const isToday = messageDate.toDateString() === now.toDateString();

  if (isToday) {
    return messageDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  return messageDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const formatChatName = (chat: Chat): string => {
  if (chat?.type === "private" && chat.participants?.[0]?.userId?.username) {
    return chat.participants[0].userId?.username || "Private Chat";
  }
  return chat?.name || "Unnamed Chat";
};
