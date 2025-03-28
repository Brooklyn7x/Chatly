import { memo } from "react";
import { useChatStore } from "@/store/useChatStore";
import { ChatItem } from "./ChatItem";

export const ChatList = memo(() => {
  const { chats, setActiveChat } = useChatStore();
  if (chats.length === 0) {
    return <h1>No Chats. Create New Chat</h1>;
  }
  return (
    <nav className="flex flex-col overflow-y-auto overflow-x-hidden">
      <ul className="p-2 space-y-1">
        {chats?.map((chat) => (
          <ChatItem
            key={chat._id}
            chat={chat}
            onClick={() => setActiveChat(chat._id)}
          />
        ))}
      </ul>
    </nav>
  );
});
