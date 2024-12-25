import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/useChatStore";
import { Chat, User } from "@/types";
import { ArrowLeft, EllipsisVertical, Phone, Search } from "lucide-react";
import { useState } from "react";

interface ChatHeaderProps {
  onProfileClick: () => void;
  chat: any;
}

export default function ChatHeader({ onProfileClick, chat }: ChatHeaderProps) {
  const { selectedChatId } = useChatStore();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="h-16 flex-shrink-0 border-b flex items-center justify-between px-6 relative">
      <div className="flex  items-center gap-4">
        {selectedChatId && (
          <button
            onClick={() => useChatStore.getState().setSelectChat(null)}
            className="md:hidden p-2 rounded-full border bg-muted/30"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        <button onClick={onProfileClick} className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage />
            <AvatarFallback>Cn</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <h2 className="text-sm font-semibold">
              {/* {chat?.type === "group"
                ? chat.metadata.title
                : chat.participants[0]?.username} */}
              header
            </h2>
            <span className="text-xs text-start text-muted-foreground font-semibold">
              {/* {chat?.type === "group"
                ? chat.participants.length
                : chat.participants[0]?.username} */}
            </span>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full hover:bg-muted/80  transition-colors hidden sm:flex">
          <Phone className="h-5 w-5" />
        </button>
        <button className="p-2 rounded-full  hover:bg-muted/80 transition-colors hidden sm:flex">
          <Search className="h-5 w-5" />
        </button>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={cn(
            "p-2 rounded-full transition-colors hover:bg-muted/80",
            showMenu && "bg-muted/90 "
          )}
        >
          <EllipsisVertical className="h-5 w-5" />
        </button>
      </div>

      {showMenu && (
        <div
          className={cn(
            "absolute top-full right-2 bg-background/80 backdrop-blur-md border rounded-md shadow-md w-[200px] py-2 px-4",
            "transition-all duration-300 ease-in-out transform",
            showMenu
              ? "opacity-100 scale-100 translate-y-1"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          )}
        >
          <div>Menu</div>
        </div>
      )}
    </div>
  );
}
