"use client";

import { memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import { formatMessageTimestamp } from "@/utils/dateUtils";
import { Chat } from "@/types";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import useChat from "@/hooks/useChat";

interface ChatItemProps {
  chat: Chat;
  isActive?: boolean;
  onSelectChat?: () => void;
  isPinned?: boolean;
  onTogglePin?: (chatId: string, e: React.MouseEvent) => void;
}

const ChatItem = memo(
  ({ chat, isActive, onSelectChat, isPinned, onTogglePin }: ChatItemProps) => {
    const { joinChat } = useChat();
    const { activeChatId } = useChat();

    const isSelected = activeChatId === chat._id;

    const handleClick = () => {
      if (onSelectChat) {
        onSelectChat();
      }

      if (!isSelected) {
        joinChat(chat._id);
      }
    };

    const chatName = useMemo(() => {
      return chat.name || chat.participants?.[0]?.userId?.username || "Unknown";
    }, [chat.name, chat.participants]);

    // const lastMessage = useMemo(() => {
    //   return chat.lastMessage?.content || "No messages yet";
    // }, [chat.lastMessage]);

    // const lastMessageTime = useMemo(() => {
    //   return chat.lastMessage?.createdAt
    //     ? formatMessageTime(chat.lastMessage.createdAt)
    //     : "";
    // }, [chat.lastMessage?.createdAt]);

    // const unreadCount = useMemo(() => {
    //   return chat.unreadCount || 0;
    // }, [chat.unreadCount]);

    const unreadCount = 0;
    const lastMessage = "No messages yet";
    const lastMessageTime = "";

    return (
      <div
        onClick={handleClick}
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
          "hover:bg-muted/50",
          isSelected && "bg-muted",
          isActive && "bg-primary/10"
        )}
      >
        <UserAvatar
          url={chat.participants?.[0]?.userId?.profilePicture}
          alt={chatName}
          size="md"
          className="flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium truncate text-sm">{chatName}</h3>
            {lastMessageTime && (
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {lastMessageTime}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground truncate">
              {lastMessage}
            </p>

            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="ml-2 h-5 min-w-5 flex items-center justify-center text-xs px-1.5"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ChatItem.displayName = "ChatItem";

export default ChatItem;
