import { useChatStore } from "@/store/useChatStore";
import { GroupChat } from "./GroupChat";
import { ChatArea } from "./ChatArea";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUiStore";
import { EmptyState } from "./EmptyChat";
import { useChatPanelStore } from "@/store/useChatPanelStore";
import { ChatInfo } from "./ChatInfo";

export const ChatContainer = () => {
  const { activeChatId } = useChatStore();
  const { isMobile } = useUIStore();
  const { isOpen } = useChatPanelStore();
  return (
    <div
      className={cn(
        "flex flex-col h-full",
        "bg-background",
        "transition-transform duration-300",
        {
          "fixed inset-0 z-50": isMobile,
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
