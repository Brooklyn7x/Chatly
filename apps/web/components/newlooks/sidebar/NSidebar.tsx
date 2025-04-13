import { useMemo, useState } from "react";
import Contacts from "../../sidebar/Contacts";
import CreateGroupChat from "../../sidebar/CreateGroup";
import CreatePrivateChat from "../../sidebar/CreatePrivateChat";
// import Setting from "../../sidebar/Setting";
import { useChatStore } from "@/store/useChatStore";
import { useFetchChats } from "@/hooks/chat/useChats";
import SidebarHeader from "./SidebarHeader";
import ChatList from "./ChatList";
import Setting from "./Setting";

const NewSidebar = () => {
  const [isPrivateModal, setIsPrivateModal] = useState(false);
  const [isGroupModal, setIsGroupModal] = useState(false);
  const [isContactModal, setIsContactModal] = useState(false);
  const [isSettingModal, setIsSettingModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string | null>("");
  const [pinnedChats, setPinnedChats] = useState<Set<string>>(new Set());

  const chats = useChatStore((state) => state.chats);
  const { isLoading, loadMore, hasMore } = useFetchChats();

  const togglePinChat = (chatId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setPinnedChats((prev) => {
      const newPinned = new Set(prev);
      if (newPinned.has(chatId)) {
        newPinned.delete(chatId);
      } else {
        newPinned.add(chatId);
      }
      return newPinned;
    });
  };

  const { pinnedFilteredChats, unpinnedFilteredChats } = useMemo(() => {
    const searchQuery = searchTerm?.trim().toLowerCase();
    const filtered = searchQuery
      ? chats.filter(
          (chat) =>
            chat.name?.toLowerCase().includes(searchQuery) ||
            chat.participants.some((p) =>
              p.userId.username?.toLowerCase().includes(searchQuery)
            )
        )
      : chats;

    return {
      pinnedFilteredChats: filtered.filter((chat) => pinnedChats.has(chat.id)),
      unpinnedFilteredChats: filtered.filter(
        (chat) => !pinnedChats.has(chat.id)
      ),
    };
  }, [searchTerm, chats, pinnedChats]);

  return (
    <div className="h-full w-full md:border md:rounded-lg bg-card text-card-foreground overflow-hidden">
      <SidebarHeader
        search={searchTerm}
        setSearch={setSearchTerm}
        onPrivateModalOpen={() => setIsPrivateModal(true)}
        onGroupModalOpen={() => setIsGroupModal(true)}
        onContactModalOpen={() => setIsContactModal(true)}
        onSettingModalOpen={() => setIsSettingModal(true)}
      />

      <ChatList
        isLoading={isLoading}
        pinnedChats={pinnedFilteredChats}
        unpinnedChats={unpinnedFilteredChats}
        onTogglePin={togglePinChat}
      />

      {isPrivateModal && (
        <CreatePrivateChat onClose={() => setIsPrivateModal(false)} />
      )}
      {isGroupModal && (
        <CreateGroupChat onClose={() => setIsGroupModal(false)} />
      )}
      {isContactModal && <Contacts onClose={() => setIsContactModal(false)} />}
      {isSettingModal && <Setting onClose={() => setIsSettingModal(false)} />}
    </div>
  );
};

export default NewSidebar;
