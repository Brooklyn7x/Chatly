import { Chat } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// import { format, isToday, isYesterday } from 'date-fns';

// export const formatMessageTime = (date: Date): string => {
//   if (isToday(date)) {
//     return format(date, 'HH:mm');
//   }
//   if (isYesterday(date)) {
//     return 'Yesterday';
//   }
//   return format(date, 'dd/MM/yyyy');
// };

export const formatFileSize = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

export const formatName = (chat: Chat) => {
  if (chat.type === "private") {
    return chat.participants[0]?.userId.username;
  }
  if (chat.type === "group") {
    return chat?.name || "Group";
  }
  if (chat.type === "channel") {
    return chat?.name || "Channel";
  }
};
