import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/useChatStore";
import { useChatPanelStore } from "@/store/useChatPanelStore";
import ChatArea from "./ChatArea";
import ChatInfo from "./ChatInfo";

interface ChatContainerProps {
  isMobile: boolean;
}

const ChatContainer = ({ isMobile }: ChatContainerProps) => {
  const { activeChatId } = useChatStore();
  const { isOpen } = useChatPanelStore();

  return (
    <div
      className={cn(
        "flex flex-col h-full",
        "bg-background/90",
        "transition-transform duration-300",
        {
          "fixed inset-0": isMobile,
          "relative flex-1": !isMobile,
          "translate-x-full": isMobile && !activeChatId,
          "translate-x-0": !isMobile || activeChatId,
        }
      )}
    >
      <ChatArea />
      {isOpen && <ChatInfo />}
    </div>
  );
};

export default ChatContainer;
