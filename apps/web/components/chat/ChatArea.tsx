import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

import { useChatStore } from "@/store/useChatStore";
import { useJoinChatSocket } from "@/hooks/chat/useJoinSocket";
import { useMessageSocket } from "@/hooks/message/useMessageSocket";

const ChatArea = () => {
  
  const chatId = useChatStore((state) => state.activeChatId);
  useJoinChatSocket(chatId || "");
  useMessageSocket();

  if (!chatId) return <div>No active chat</div>

  return (
    <div className="inset-0 overflow-hidden h-full w-full md:border md:rounded-lg bg-card text-card-foreground flex flex-col">
      <ChatHeader />
      <ChatMessages />
      <ChatInput />
    </div>
  );
};

export default ChatArea;
