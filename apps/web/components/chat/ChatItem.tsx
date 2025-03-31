import { useMemo } from "react";
import { UserAvatar } from "../shared/UserAvatar";
import { cn, formatName } from "@/lib/utils";
import { Chat } from "@/types";
import { useChatStore } from "@/store/useChatStore";

interface ChatItemProps {
  chat: Chat;
  onClick: () => void;
}

export function ChatItem({ chat, onClick }: ChatItemProps) {
  const { activeChatId } = useChatStore();
  const isActive = activeChatId === chat._id;

  const formattedDate = useMemo(() => {
    if (!chat.updatedAt) return "";
    const date = new Date(chat.updatedAt);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }, [chat.updatedAt]);

  const displayName = formatName(chat);
  return (
    <div
      onClick={onClick}
      className={cn(
        "w-full p-2 rounded-md border",
        "transition-colors duration-200",
        "hover:bg-muted/50",
        isActive && "bg-muted/80"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <UserAvatar url={chat.participants[0]?.userId.profilePicture || ""} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="mb-1 flex justify-between items-baseline">
            <h3 className="font-medium truncate text-md">{displayName}</h3>
            <span className="text-xs text-muted-foreground">
              {formattedDate}
            </span>
          </div>
          {/* 
          <div className="flex items-center ml-2">
            {chat.isPinned && <span>📌</span>}
            {chat.isMuted && <span>🔇</span>}
            {chat.unreadCount > 0 && (
              <div 
                className={`
                  ml-2 px-2 py-1 rounded-full text-xs font-medium
                  ${chat.isMuted ? 'bg-telegram-badge-muted' : 'bg-telegram-badge'}
                `}
              >
                {chat.unreadCount}
              </div>
            )}
          </div>
        </div> */}

          <div className="flex justify-between items-baseline">
            <p className="text-sm text-muted-foreground truncate">
              {"No messages yet"}
            </p>
            <span className="ml-2 bg-primary text-primary-foreground rounded-full text-xs h-5 w-5 flex items-center justify-center ">
              10
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
