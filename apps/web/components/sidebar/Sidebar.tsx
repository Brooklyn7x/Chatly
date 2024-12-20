import { useMemo, useState } from "react";
import { useUIStore } from "@/store/useUiStore";
import { cn } from "@/lib/utils";
import { Edit2, User } from "lucide-react";
import { ChatList } from "../chat/ChatList";
import { SidebarHeader } from "./SidebarHeader";
import { useChatStore } from "@/store/useChatStore";
export default function SideBar() {
  const { isMobile } = useUIStore();
  const { selectedChatId } = useChatStore();
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const chats = useChatStore((state) => state.chats);
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;

    return chats.filter((chat) => {
      const searchTerm = searchQuery.toLowerCase();
      const chatName = chat.isGroup
        ? chat.groupName?.toLowerCase()
        : chat.participants[0]?.name.toLowerCase();

      const lastMessage = chat.lastMessage?.content.toLowerCase();
      return (
        chatName?.includes(searchTerm) || lastMessage?.includes(searchTerm)
      );
    });
  }, [chats, searchQuery]);
  return (
    <div
      className={cn(
        "w-full md:w-[420px] md:border-r",
        "flex flex-col relative",
        isMobile && selectedChatId ? "-translate-x-full" : "translate-x-0",
        "transition-[transform,width] duration-200 ease-in-out",
        "md:translate-x-0",
        isMobile ? "absolute inset-y-0 left-0 z-10" : "relative"
      )}
    >
      <SidebarHeader
        onSearchQuery={searchQuery}
        onSetSearchQuery={setSearchQuery}
      />
      <ChatList chats={filteredChats} />

      <div className="absolute bottom-6 right-6">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={cn(
            "h-14 w-14 text-center bg-muted/80 rounded-full flex items-center justify-center hover:bg-slate-500/80"
          )}
        >
          <Edit2 className="h-6 w-6" />
        </button>
      </div>

      {showMenu && (
        <div className="absolute bottom-20 mb-2 right-8 w-[200px] border bg-background/90 backdrop-blur-sm z-20 p-1 rounded-md">
          <button className="w-full flex items-center gap-4 px-4 py-1 hover:bg-slate-500/50 hover:rounded-md">
            <User className="h-4 w-4" />
            <span className="text-sm">New private chat</span>
          </button>
        </div>
      )}
    </div>
  );
}
