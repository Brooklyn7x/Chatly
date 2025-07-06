import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import ChatArea from "../features/chat/ChatArea";
import EmptyChat from "../features/chat/EmptyChat";
import useChat from "@/hooks/useChat";

const ChatInfo = dynamic(() => import("../features/chat/ChatInfo"), {
  ssr: false,
});

const ChatLayout = () => {
  const { activeChatId } = useChat();

  return (
    <div
      className={`w-full  ${!activeChatId ? "hidden md:flex" : "flex"} flex-col md:p-2`}
    >
      {activeChatId ? (
        <div className={cn("flex-1 overflow-auto")}>
          <ChatArea />
          <ChatInfo />
        </div>
      ) : (
        <EmptyChat />
      )}
    </div>
  );
};

export default ChatLayout;
