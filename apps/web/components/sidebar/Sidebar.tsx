import { useEffect, useMemo, useState } from "react";
import { useUIStore } from "@/store/useUiStore";
import { cn } from "@/lib/utils";
import { ChatList } from "../chat/ChatList";
import { SidebarHeader } from "./SidebarHeader";
import { useChatStore } from "@/store/useChatStore";
import { SidebarMenu } from "./SidebarMenu";
import { DirectModal } from "./DirectModal";
import { GroupModal } from "./GroupModal";

export default function SideBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const { isMobile } = useUIStore();
  const { selectedChatId, fetchChats } = useChatStore();
  const chats = useChatStore((state) => state.chats);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;

    return chats.filter((chat) => {
      const searchTerm = searchQuery.toLowerCase();
      const chatName = chat.isGroup
        ? chat.groupName?.toLowerCase()
        : chat.participants[0]?.username.toLowerCase();

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
        onSearchActive={showSearch}
        onSearchQuery={searchQuery}
        onSearchClick={() => setShowSearch(true)}
        onSetSearchQuery={setSearchQuery}
        onBackClick={() => setShowSearch(false)}
      />

      {showSearch ? <h1>Search Related things</h1> : <ChatList chats={chats} />}

      <SidebarMenu
        onShowContactModal={() => setShowContactModal(true)}
        onCreateGroup={() => setShowGroupModal(true)}
        onCreateChat={() => {}}
      />

      <DirectModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />

      <GroupModal
        isOpen={showGroupModal}
        onClose={() => setShowGroupModal(false)}
      />
    </div>
  );
}
