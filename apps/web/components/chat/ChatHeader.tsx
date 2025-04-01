import { cn, formatName } from "@/lib/utils";
import { useChatStore } from "@/store/useChatStore";
import { NavigationButton } from "../shared/NavigationButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ArrowLeft,
  BoxSelectIcon,
  EllipsisVertical,
  LucideIcon,
  Phone,
  Trash,
} from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import { useChatPanelStore } from "@/store/useChatPanelStore";
import { UserAvatar } from "../shared/UserAvatar";

import { Chat } from "@/types";
import MessageSearch from "../message/MessageSearch";
import useUserStatusStore from "@/store/useUserStatusStore";

interface ChatHeaderProps {
  chat: Chat;
  selectMessage?: () => void;
}
export default function ChatHeader({ chat }: ChatHeaderProps) {
  const { user } = useAuthStore();
  const { setIsOpen } = useChatPanelStore();
  const { activeChatId, setActiveChat } = useChatStore();
  const { getUserStatus } = useUserStatusStore();
  const otherUser = chat?.participants.find((p) => p.userId.id !== user?._id);
  const otherUserId = otherUser?.userId?._id;
  const isOnline = getUserStatus(otherUserId || "");

  const displayName = formatName(chat);

  // const handleDelete = () => {
  //   if (!activeChatId) return;
  //   deleteCht(activeChatId);
  // };

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
          <UserAvatar />
          <div className="flex flex-col text-left">
            <h2 className="text-sm font-semibold">{displayName}</h2>
            <span className="text-xs text-start text-muted-foreground font-semibold">
              {chat?.type === "group" && (
                <span>{chat.participants.length} Memebers</span>
              )}
            </span>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <IconButton onClick={() => {}} icon={Phone} isActive={false} />
        {/* <IconButton onClick={() => {}} icon={Search} isActive={false} /> */}

        <MessageSearch />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent">
              <EllipsisVertical className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" alignOffset={10} className="w-44">
            <DropdownMenuItem onClick={() => {}}>
              <div className="flex items-center gap-4 text-muted-foreground">
                <Trash size={16} />
                <p>Delete</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>
              <div className="flex items-center gap-4 text-muted-foreground">
                <BoxSelectIcon size={16} />
                <p>Select messages</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
