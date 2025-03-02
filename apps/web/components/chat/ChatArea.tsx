import { useChatStore } from "@/store/useChatStore";
import { useChatSocket } from "@/hooks/useChatSocket";
import MessageList from "../message/MessageList";
import ChatHeader from "./ChatHeader";
import MessageInput from "../message/MessageInput";
import { EmptyState } from "./EmptyChat";
import { Suspense } from "react";
import { useMessageSocket } from "@/hooks/useMessageSocket";

export const ChatArea = () => {
  const { activeChatId, chats } = useChatStore();

  const chat = chats?.find((chat) => chat._id === activeChatId);
  useChatSocket(activeChatId || "");
  useMessageSocket();
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
