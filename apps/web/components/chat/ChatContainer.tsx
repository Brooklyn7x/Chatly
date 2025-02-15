import { useChatStore } from "@/store/useChatStore";
import { GroupChat } from "./GroupChat";
import { PrivateChat } from "./PrivateChat";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUiStore";
import { EmptyState } from "./EmptyChat";
import { useChatPanelStore } from "@/store/useChatPanelStore";
import { ChatInfo } from "./ChatInfo";

export const ChatContainer = () => {
  const { chats, activeChatId } = useChatStore();
  const { isMobile } = useUIStore();
  const chat = chats.find((chat) => chat._id === activeChatId);
  const { isOpen } = useChatPanelStore();
  const renderChat = () => {
    switch (chat?.type) {
      case "direct":
        return <PrivateChat />;
      case "group":
        return <GroupChat />;
      //   case "channel":
      //     return <ChannelChat />;
      default:
        return <EmptyState />;
    }
  };
  return (
    <div
      className={cn(
        "flex flex-col h-full",
        "dark:bg-neutral-900",
        "transition-transform duration-300",
        {
          "fixed inset-0 z-50": isMobile,
          "relative flex-1": !isMobile,
          "translate-x-full": isMobile && !activeChatId,
          "translate-x-0": !isMobile || activeChatId,
        }
      )}
    >
      {renderChat()}

      {isOpen && <ChatInfo />}
    </div>
  );
};
