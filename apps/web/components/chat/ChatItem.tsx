import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Chat } from "@/types";

interface ChatItemProps {
  isActive: boolean;
  onClick: () => void;
  chat: Chat;
}

export function ChatItem({ isActive, onClick, chat }: ChatItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "px-4 py-4 cursor-pointer transition-colors",
        isActive && "bg-muted/60",
        "hover:bg-muted/30"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage />
            <AvatarFallback>Cn</AvatarFallback>
          </Avatar>
          {chat.participants[0]?.status === "online" && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline">
            <h3 className="font-medium truncate text-md">
              {chat.participants[0]?.name}
            </h3>
            <span className="text-xs text-muted-foreground">{"10 Dec"}</span>
          </div>

          <div className="flex justify-between items-baseline mt-1">
            <p className="text-sm text-muted-foreground truncate">
              {chat.lastMessage?.content}
            </p>
            <span className="ml-2 bg-primary text-primary-foreground rounded-full text-xs h-5 w-5 flex items-center justify-center ">
              {chat.unreadCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
