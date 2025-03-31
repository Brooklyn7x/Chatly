import { memo } from "react";
import { ChatItem } from "./ChatItem";
import { Chat } from "@/types";

interface ChatListProps {
  chats: Chat[];
  onSelectChat: (chatId: string) => void;
}
export const ChatList = memo(({ chats, onSelectChat }: ChatListProps) => {
  return (
    <nav className="flex flex-col overflow-y-auto overflow-x-hidden">
      <ul className="p-2 space-y-1">
        {chats?.map((chat) => (
          <ChatItem
            key={chat._id}
            chat={chat}
            onClick={() => onSelectChat(chat._id)}
          />
        ))}
      </ul>
    </nav>
  );
});
