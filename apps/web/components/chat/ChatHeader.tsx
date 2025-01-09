import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/useChatStore";
import { Chat } from "@/types";
import ChatMenu from "./ChatMenu";
import { NavigationButton } from "../shared/NavigationButton";
import { UserAvatar } from "../user/UserAvatar";
import {
  ArrowLeft,
  EllipsisVertical,
  LucideIcon,
  Phone,
  Search,
} from "lucide-react";

interface ChatHeaderProps {
  onProfileClick: () => void;
  chat: Chat;
  isOnline: boolean;
}

export default function ChatHeader({
  onProfileClick,
  chat,
  isOnline,
}: ChatHeaderProps) {
  const { selectedChatId, deleteChat, setSelectChat } = useChatStore();
  const [showMenu, setShowMenu] = useState(false);

  const handleBack = useCallback(() => {
    setSelectChat(null);
  }, [setSelectChat]);

  const chatTitle =
    chat?.type === "direct" ? "Direct" : chat?.metadata?.title || "Group";
  const chatSubtitle =
    chat?.type === "group"
      ? `${chat.participants.length} Subscribers`
      : "Online";
  return (
    <header className="h-16 flex-shrink-0 border-b flex items-center justify-between px-6 relative bg-background">
      <div className="flex  items-center gap-4">
        {selectedChatId && (
          <NavigationButton onClick={handleBack} icon={ArrowLeft} />
        )}

        <button onClick={onProfileClick} className="flex items-center gap-4">
          <UserAvatar status={isOnline ? "online" : "offline"} size={"sm"} />
          <div className="flex flex-col text-left">
            <h2 className="text-sm font-semibold">{chatTitle}</h2>
            <span className="text-xs text-start text-muted-foreground font-semibold">
              {/* {chatSubtitle} */}
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-1">
        <IconButton onClick={() => {}} icon={Phone} isActive={false} />
        <IconButton onClick={() => {}} icon={Search} isActive={false} />
        <IconButton
          onClick={() => setShowMenu(!showMenu)}
          icon={EllipsisVertical}
          isActive={showMenu}
        />
      </div>

      <ChatMenu
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        onDelete={deleteChat}
        chatId={chat?.id}
      />
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
