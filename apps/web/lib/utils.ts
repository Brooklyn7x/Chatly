import { Chat } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
  if (!chat) return;
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

export function generateAvatarUrl(seed: string) {
  const encodedSeed = encodeURIComponent(seed);
  return `https://api.dicebear.com/7.x/personas/png?seed=${encodedSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
}
