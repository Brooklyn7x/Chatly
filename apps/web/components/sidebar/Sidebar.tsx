import { useCallback, useEffect, useMemo, useState } from "react";
import { useUIStore } from "@/store/useUiStore";
import { cn } from "@/lib/utils";
import { ChatList } from "../chat/ChatList";
import { SidebarHeader } from "./SidebarHeader";
import { useChatStore } from "@/store/useChatStore";
import { SidebarMenu } from "./SidebarMenu";
import { DirectModal } from "../modal/DirectModal";
import { GroupModal } from "../modal/GroupModal";
import SearchContent from "./SearchContent";

export default function SideBar() {
  const { isMobile } = useUIStore();
  const { selectedChatId, fetchChats } = useChatStore();
  const chats = useChatStore((state) => state.chats);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showDirectModal, setShowDirectModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);

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

  const handleSearchClick = useCallback(() => {
    setShowSearch(true);
  }, [setShowSearch]);

  const handleBackClick = useCallback(() => {
    setShowSearch(false);
    setSearchQuery("");
  }, [setShowSearch, setSearchQuery]);

  const handleShowGroupModal = useCallback(() => {
    setShowGroupModal(true);
  }, []);
  const handleShowDirectModal = useCallback(() => {
    setShowDirectModal(true);
  }, []);
  const handleCloseDirectModal = useCallback(() => {
    setShowDirectModal(false);
  }, []);
  const handleCloseGroupModal = useCallback(() => {
    setShowGroupModal(false);
  }, []);

  return (
    <aside
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
        onSetSearchQuery={setSearchQuery}
        onSearchClick={handleSearchClick}
        onBackClick={handleBackClick}
      />
      <main className="flex-1 overflow-y-auto">
        {showSearch ? <SearchContent /> : <ChatList chats={chats} />}
      </main>

      <SidebarMenu
        onShowContactModal={handleShowDirectModal}
        onCreateGroup={handleShowGroupModal}
        onCreateChat={() => {}}
      />

      <DirectModal isOpen={showDirectModal} onClose={handleCloseDirectModal} />

      <GroupModal isOpen={showGroupModal} onClose={handleCloseGroupModal} />
    </aside>
  );
}
