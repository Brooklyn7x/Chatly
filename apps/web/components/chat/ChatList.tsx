import { memo } from "react";
import { Chat, useChatStore } from "@/store/useChatStore";
import { ChatItem } from "./ChatItem";

interface ChatListProps {
  chats: Chat[];
}

export const ChatList = memo(({ chats }: ChatListProps) => {
  const { selectedChatId, setSelectChat } = useChatStore();
  if (chats.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <p className="text-muted-foreground text-center">
          No conversations yet. Start a new chat to begin messaging.
        </p>
      </div>
    );
  }
  return (
    <nav className="flex flex-col overflow-y-auto overflow-x-hidden">
      <ul className="p-2 space-y-1">
        {chats.map((chat) => (
          <ChatItem
            key={chat._id}
            isActive={selectedChatId === chat._id}
            onClick={() => setSelectChat(chat._id)}
            chat={chat}
          />
        ))}
      </ul>
    </nav>
  );
});
