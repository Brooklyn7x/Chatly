import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import ChatArea from "./ChatArea";
import EmptyChat from "./EmptyChat";
import { useChatStore } from "@/store/useChatStore";
import { useChatPanelStore } from "@/store/useChatPanelStore";

const ChatInfo = dynamic(() => import("./ChatInfo"), {
  ssr: false,
});

const ChatContainer = () => {
  const { activeChatId } = useChatStore();
  const { isOpen } = useChatPanelStore();

  return (
    <div
      className={`w-full  ${!activeChatId ? "hidden md:flex" : "flex"} flex-col md:p-2`}
    >
      {activeChatId ? (
        <div className={cn("flex-1 overflow-auto")}>
          <ChatArea />
          {isOpen && <ChatInfo />}
        </div>
      ) : (
        <EmptyChat />
      )}
    </div>
  );
};

export default ChatContainer;
