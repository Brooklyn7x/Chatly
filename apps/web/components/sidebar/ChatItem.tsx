import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Chat } from "@/types";
import { formatChatName, formatDate } from "@/utils";
import { useMemo, useState } from "react";
import { ChatAvatar } from "../common/ChatAvatar";
import { Ellipsis, PinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatPanelStore } from "@/store/useChatPanelStore";
import { useSocketStore } from "@/store/useSocketStore";
import { toast } from "sonner";

interface ChatItemProps {
  chat: Chat;
  onSelectChat: (chatId: string) => void;
  isActive: boolean;
  isPinned: boolean;
  onTogglePin: (chatId: string, event: React.MouseEvent) => void;
}

const ChatItem = ({
  chat,
  onSelectChat,
  isActive,
  isPinned,
  onTogglePin,
}: ChatItemProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const openPanel = useChatPanelStore((state) => state.setIsOpen);
  const socket = useSocketStore((state) => state.socket);

  const formattedDate = useMemo(() => {
    if (!chat.updatedAt) return "";
    return formatDate(chat.updatedAt);
  }, [chat.updatedAt]);

  const handleDelete = async () => {
    setIsDeleting(true);
    socket?.emit(
      "conversation:delete",
      { conversationId: chat.id },
      (error: any) => {
        setIsDeleting(false);
        if (error) {
          toast.error(error.error || "Failed to delete the conversation");
        } else {
          toast.success("Chat deleted successfully");
        }
      }
    );
  };

  return (
    <div
      onClick={() => onSelectChat(chat.id)}
      className={`${
        isActive ? "bg-muted" : ""
      } group hover:bg-muted/60 relative cursor-pointer px-6 py-4 flex gap-4 min-w-0`}
    >
      <ChatAvatar chat={chat} />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium truncate">
            {formatChatName(chat)}
          </span>
          <span className="text-xs text-muted-foreground shrink-0">
            {formattedDate}
          </span>
        </div>

        <div className="flex items-center justify-between text-muted-foreground">
          <div className="flex items-center gap-2">
            {/* <Check size={16} /> */}
            <span className="text-sm truncate">"No messages yet"</span>
          </div>
          {isPinned && <PinIcon size={14} />}
        </div>
      </div>

      <div className="flex items-center absolute top-5 end-5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full bg-background/60 hover:bg-background/80"
            >
              <Ellipsis size={16} className="text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            alignOffset={10}
            className="min-w-32 bg-background"
          >
            <DropdownMenuItem onClick={(e) => onTogglePin(chat.id, e)}>
              {isPinned ? "Unpin" : "Pin"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                openPanel(true);
                setIsMenuOpen(false);
              }}
            >
              View Profile
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive"
              onClick={handleDelete}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatItem;
