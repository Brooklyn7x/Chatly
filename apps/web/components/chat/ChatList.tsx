import { useChatStore } from "@/store/useChatStore";
import { ChatItem } from "./ChatItem";
import { Chat } from "@/types";

interface ChatListProps {
  chats: Chat[];
}

export function ChatList({ chats }: ChatListProps) {
  const { selectedChatId, setSelectChat } = useChatStore();
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="divide-y">
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            isActive={selectedChatId === chat.id}
            onClick={() => setSelectChat(chat.id)}
            chat={chat}
          />
        ))}
      </div>
    </div>
  );
}
