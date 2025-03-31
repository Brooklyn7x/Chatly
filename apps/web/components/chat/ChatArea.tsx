import { useMemo } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import { useChatStore } from "@/store/useChatStore";
import MessageList from "../message/MessageList";
import { useJoinChatSocket } from "@/hooks/useJoinSocket";
import { useChatSocket } from "@/hooks/useChatSocket";

const ChatArea = () => {
  const { activeChatId, chats } = useChatStore();

  useJoinChatSocket(activeChatId || "");
  useChatSocket(activeChatId || "");
  // useTypingIndicator(activeChatId || "");

  const chat = useMemo(() => {
    return chats?.find((chat) => chat._id === activeChatId);
  }, [chats, activeChatId]);

  if (!chat) return null;

  return (
    <div className="flex flex-col h-full">
      <>
        <div className="flex-shrink-0">
          <ChatHeader chat={chat} />
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <MessageList />
          </div>
        </div>
        <div className="flex-shrink-0 pb-4">
          <ChatInput />
        </div>
      </>
    </div>
  );
};

export default ChatArea;
