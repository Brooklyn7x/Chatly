import { useChatStore } from "@/store/chat-store";
import { ChatItem } from "./ChatItem";
import { Chat } from "@/store/chat-store";
interface ChatListProps {
  chats: Chat[];
}

export function ChatList({ chats }: ChatListProps) {
  const { selectedChatId, selectChat } = useChatStore();
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="divide-y">
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            isActive={selectedChatId === chat.id}
            onClick={() => selectChat(chat.id)}
            chat={chat}
          />
        ))}
      </div>
    </div>
  );
}
