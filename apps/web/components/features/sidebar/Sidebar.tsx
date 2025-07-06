"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import useChat from "@/hooks/useChat";
import { useChatStore } from "@/store/useChatStore";
import { useFetchChats } from "@/hooks/chat/useChats";

import SidebarHeader from "./SidebarHeader";
import ChatList from "./ChatList";
import useAppStore from "@/store/useAppStore";

const Setting = dynamic(() => import("./AppSetting"), { ssr: false });
const Contacts = dynamic(() => import("./Contacts"), { ssr: false });
const CreateGroup = dynamic(() => import("./CreateGroup"), { ssr: false });
const CreatePrivateChat = dynamic(() => import("./CreatePrivateChat"), {
  ssr: false,
});

const Sidebar = () => {
  /* mobile behaviour */
  const { activeChatId } = useChat();

  /* local UI state */
  // const [isPrivateModal, setPrivateModal] = useState(false);
  // const [isGroupModal, setGroupModal] = useState(false);
  // const [isContactModal, setContactModal] = useState(false);
  // const [isSettingOpen, setSettingOpen] = useState(false);
  const { modals, openModal, closeModal } = useAppStore();
  const [search, setSearch] = useState("");
  const [pinned, setPinned] = useState<Set<string>>(new Set());

  /* data layer */
  const chats = useChatStore((s) => s.chats);
  const { isLoading } = useFetchChats(); // loadMore / hasMore kept inside hook

  /* pin / un-pin a chat */
  const togglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinned((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const { pinnedFiltered, unpinnedFiltered } = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filter = q
      ? chats.filter(
          (c) =>
            c.name?.toLowerCase().includes(q) ||
            c.participants.some((p) =>
              p.userId.username?.toLowerCase().includes(q)
            )
        )
      : chats;

    return {
      pinnedFiltered: filter.filter((c) => pinned.has(c.id)),
      unpinnedFiltered: filter.filter((c) => !pinned.has(c.id)),
    };
  }, [search, chats, pinned]);

  return (
    <div
      className={`w-full h-full md:w-[400px] overflow-hidden md:p-2 relative ${
        activeChatId ? "hidden md:block" : "block"
      }`}
    >
      <div className="h-full w-full md:border md:rounded-lg bg-card text-card-foreground overflow-hidden p-2">
        <SidebarHeader
          search={search}
          setSearch={setSearch}
          onPrivateModalOpen={() => openModal("createPrivateChat")}
          onGroupModalOpen={() => openModal("createGroup")}
          onContactModalOpen={() => openModal("contacts")}
          onSettingModalOpen={() => openModal("settings")}
        />

        {modals.settings ? (
          <Setting onClose={() => closeModal("settings")} />
        ) : (
          <ChatList
            isLoading={isLoading}
            pinnedChats={pinnedFiltered}
            unpinnedChats={unpinnedFiltered}
            onTogglePin={togglePin}
          />
        )}

        {modals.createPrivateChat && (
          <CreatePrivateChat onClose={() => closeModal("createPrivateChat")} />
        )}
        {modals.createGroup && (
          <CreateGroup onClose={() => closeModal("createGroup")} />
        )}
        {modals.contacts && <Contacts onClose={() => closeModal("contacts")} />}
      </div>
    </div>
  );
};

export default Sidebar;
