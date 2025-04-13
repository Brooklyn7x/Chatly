import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, EllipsisVertical } from "lucide-react";
import { ChatAvatar } from "../common/ChatAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useChatStore } from "@/store/useChatStore";
import { useChatPanelStore } from "@/store/useChatPanelStore";
import useUserStatusStore from "@/store/useUserStatusStore";
import { useAuth } from "@/hooks/auth/useAuth";
import { useMessage } from "@/hooks/message/useMessage";
import { useTypingIndicator } from "@/hooks/message/useTypingIndicator";
import { formatChatName } from "@/utils";

const ChatHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const { setActiveChat } = useChatStore();
  const { setIsOpen } = useChatPanelStore();
  const { getUserStatus } = useUserStatusStore();
  const userId = user?._id;
  const activeChatId = useChatStore((state) => state.activeChatId);
  const chats = useChatStore((state) => state.chats);

  const { isTyping } = useTypingIndicator(activeChatId || "");
  const { markAllRead } = useMessage();

  const handleMessageAllRead = () => {
    if (!activeChatId) return;
    markAllRead({ chatId: activeChatId });
  };

  const chat = useMemo(() => {
    return chats?.find((chat) => chat._id === activeChatId);
  }, [chats, activeChatId]);

  const otherUser = chat?.participants.find((p) => p.userId.id !== userId);
  const otherUserId = otherUser?.userId?._id;

  const isOnline = getUserStatus(otherUserId || "");

  const handleChatPanel = () => {
    setIsOpen(true);
    setIsMenuOpen(false);
  };

  return (
    <div className="border-b p-4 flex items-center justify-between cursor-pointer">
      <div className="flex items-center gap-3">
        <Button
          variant={"outline"}
          size={"icon"}
          className="md:hidden"
          onClick={() => setActiveChat(null)}
        >
          <ArrowLeft size={14} />
        </Button>

        <ChatAvatar chat={chat as any} />

        <div onClick={() => setIsOpen(true)}>
          <h2 className="font-semibold">
            {chat ? formatChatName(chat) : "Chat"}
          </h2>

          {chat?.type === "private" && isOnline && !isTyping && (
            <p className="text-xs text-green-400">Online</p>
          )}

          {chat?.type === "private" && isTyping && (
            <p className="text-xs text-muted-foreground">Typing...</p>
          )}

          {chat?.type === "group" && isTyping && (
            <p className="text-xs text-muted-foreground">
              Someone is Typing...
            </p>
          )}
        </div>
      </div>

      <div>
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <EllipsisVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background">
            <DropdownMenuItem onClick={handleChatPanel}>
              View Profile
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleMessageAllRead}>
              Mark All Read
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleChatPanel}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatHeader;
