import { useChatStore } from "@/store/useChatStore";
import { ChatArea } from "./ChatArea";
import { cn } from "@/lib/utils";
import { useChatPanelStore } from "@/store/useChatPanelStore";
import { ChatInfo } from "./ChatInfo";

interface ChatContainerProps {
  isMobile: boolean;
}

export const ChatContainer = ({ isMobile }: ChatContainerProps) => {
  const { activeChatId } = useChatStore();
  const { isOpen } = useChatPanelStore();
  return (
    <div
      className={cn(
        "flex flex-col h-full",
        "bg-secondary/30",
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
