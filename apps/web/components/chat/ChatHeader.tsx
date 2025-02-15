import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/useChatStore";
import { NavigationButton } from "../shared/NavigationButton";
import { UserAvatar } from "../user/UserAvatar";
import {
  ArrowLeft,
  EllipsisVertical,
  LucideIcon,
  Phone,
  Search,
} from "lucide-react";
import { useUserStatus } from "@/hooks/useUserStatus";
import useAuthStore from "@/store/useAuthStore";
import ChatHeaderMenu from "./ChatHeaderMenu";
import { useChatPanelStore } from "@/store/useChatPanelStore";

export default function ChatHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuthStore;
  const { activeChatId, chats, setActiveChat, deleteChat } = useChatStore();
  const chat = chats.find((chat) => chat._id === activeChatId);
  const otherUser = chat?.participants.find((p) => p.userId.id !== user);

  const { setIsOpen } = useChatPanelStore();

  const otherUserId = otherUser?.userId?._id;
  const { status, getStatusText } = useUserStatus(otherUserId);

  const displayName = useMemo(() => {
    if (chat?.type === "direct") {
      return chat.participants[1]?.userId.username || "Direct Message";
    }
    return chat?.metadata?.title || "Group Chat";
  }, [chat]);

  const getChatSubtitle =
    chat?.type === "group"
      ? `${chat.participants.length} Subscribers`
      : "Online";

  return (
    <header className="h-16 w-full flex-shrink-0 border-b flex items-center justify-between px-6 relative bg-background">
      <div className="flex items-center gap-4">
        {activeChatId && (
          <NavigationButton
            onClick={() => setActiveChat(null)}
            icon={ArrowLeft}
          />
        )}

        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-4"
        >
          <UserAvatar
            status={status === "online" ? "online" : "offline"}
            size={"sm"}
          />
          <div className="flex flex-col text-left">
            <h2 className="text-sm font-semibold">{displayName}</h2>
            <span className="text-xs text-start text-muted-foreground font-semibold">
              {chat?.type === "group"
                ? `${chat.participants.length} members`
                : getStatusText()}
            </span>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-1">
        <IconButton onClick={() => {}} icon={Phone} isActive={false} />
        <IconButton onClick={() => {}} icon={Search} isActive={false} />
        <IconButton
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          icon={EllipsisVertical}
          isActive={isMenuOpen}
        />
      </div>

      {isMenuOpen && (
        <ChatHeaderMenu
          onClose={() => setIsMenuOpen(false)}
          chatId={activeChatId}
          onDeleteChat={deleteChat}
        />
      )}
    </header>
  );
}

interface ButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  isActive?: boolean;
  className?: string;
}
const IconButton = ({
  onClick,
  icon: Icon,
  isActive,
  className,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-10 w-10",
        "flex items-center justify-center",
        "rounded-full",
        "transition-all duration-200",
        "hover:bg-muted/70 active:scale-95",
        isActive && "bg-muted/90",
        className
      )}
    >
      <Icon
        className={cn("h-5 w-5 transition-transform", isActive && "scale-105")}
      />
    </button>
  );
};
