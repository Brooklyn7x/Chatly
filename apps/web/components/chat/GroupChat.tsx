import { useGroupSocket } from "@/hooks/useGroupSocket";
import { useChatStore } from "@/store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageList from "../message/MessageList";
import MessageInput from "../message/MessageInput";

export const GroupChat = () => {
  const { activeChatId } = useChatStore();
  useGroupSocket(activeChatId || "");
  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0">
        <ChatHeader />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <MessageList />
        </div>
      </div>
      <div className="flex-shrink-0 pb-4">
        <MessageInput />
      </div>
    </div>
  );
};
