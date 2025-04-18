import { cn } from "@/lib/utils";
import ChatArea from "./ChatArea";
import ChatInfo from "./ChatInfo";
import EmptyChat from "./EmptyChat";
import { useChatStore } from "@/store/useChatStore";

const ChatContainer = () => {
  const { activeChatId } = useChatStore();

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

export default ChatContainer;
