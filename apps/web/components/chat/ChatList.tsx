import { Chat, useChatStore } from "@/store/useChatStore";
import { ChatItem } from "./ChatItem";

interface ChatListProps {
  chats: Chat[];
}

export function ChatList({ chats }: ChatListProps) {
  const { selectedChatId, setSelectChat } = useChatStore();
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-2 space-y-1">
        {chats.map((chat, index) => (
          <ChatItem
            key={index}
            isActive={selectedChatId === chat._id}
            onClick={() => setSelectChat(chat._id)}
            chat={chat}
          />
        ))}
      </div>
    </div>
  );
}
