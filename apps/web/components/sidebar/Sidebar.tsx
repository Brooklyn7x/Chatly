import { useMemo, useState } from "react";
import { useUIStore } from "@/store/useUiStore";
import { cn } from "@/lib/utils";
import { ChatList } from "../chat/ChatList";
import { SidebarHeader } from "./SidebarHeader";
import { useChatStore } from "@/store/useChatStore";
import { SidebarMenu } from "./SidebarMenu";
export default function SideBar() {
  const { isMobile } = useUIStore();
  const { selectedChatId, createChat } = useChatStore();
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
      
      <SidebarMenu
        onCreateChat={() => {
          createChat([
            {
              id: "1",
              name: "John Doe",
              avatar: "https://randomuser.me/api/portraits",
              status: "online",
            },
          ]);
        }}
      />
    </div>
  );
}
