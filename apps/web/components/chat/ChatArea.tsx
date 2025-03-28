import { Suspense, useMemo } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "../message/MessageList";
import MessageInput from "../message/MessageInput";
import { EmptyState } from "./EmptyChat";
import { useChatStore } from "@/store/useChatStore";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useMessageSocket } from "@/hooks/useMessageSocket";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";

const ChatArea = () => {
  const { activeChatId, chats } = useChatStore();

  useChatSocket(activeChatId || "");
  useMessageSocket();
  useTypingIndicator(activeChatId || "");

  const chat = useMemo(() => {
    return chats?.find((chat) => chat._id === activeChatId);
  }, [chats, activeChatId]);

  if (!chat) return null;

  return (
    <div className="flex flex-col h-full">
      {activeChatId ? (
        <>
          <div className="flex-shrink-0">
            <ChatHeader chat={chat} />
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
              <Suspense fallback={<p>MessageList...</p>}>
                <MessageList />
              </Suspense>
            </div>
          </div>
          <div className="flex-shrink-0 pb-4">
            <MessageInput />
          </div>
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default ChatArea;
