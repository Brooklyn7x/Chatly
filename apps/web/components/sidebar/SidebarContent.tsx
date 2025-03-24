import { useMemo, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useChatStore } from "@/store/useChatStore";
import { useDebounce } from "@/hooks/useDebounce";
import { ChatItem } from "../chat/ChatItem";
import ChatFilters from "./ChatFilter";
import { fetchChats } from "@/hooks/useChats";
import { ViewType } from "@/types";

const PrivateChat = dynamic(() => import("./PrivateChat"), { ssr: false });
const GroupChat = dynamic(() => import("./GroupChat"), { ssr: false });
const Setting = dynamic(() => import("./Setting"), { ssr: false });
const ThemeSettingsPage = dynamic(() => import("../theme/ThemeSettings"), {
  ssr: false,
});

type FilterOption = {
  label: string;
  value: "all" | "favorites" | "groups" | "direct" | "channel";

  icon: React.ReactNode;
};
interface SidebarContentProps {
  view: ViewType;
  searchQuery: string;
  onViewChange: (view: ViewType) => void;
}

export default function SidebarContent({
  view,
  searchQuery,
  onViewChange,
}: SidebarContentProps) {
  const { setActiveChat, chats } = useChatStore();

  const [selectedFilter, setSelectedFilter] =
    useState<FilterOption["value"]>("all");

  const debouncedQuery = useDebounce(searchQuery, 300);
  const filteredChats = useMemo(() => {
    let baseChats = Array.isArray(chats) ? chats : [];

    switch (selectedFilter) {
      case "favorites":
        // baseChats = baseChats.filter((chat) => chat.isFavorite);
        break;
      case "groups":
        baseChats = baseChats.filter((chat) => chat.type === "group");
        break;
      case "direct":
        baseChats = baseChats.filter((chat) => chat.type === "direct");
        break;
    }

    if (debouncedQuery.trim()) {
      const searchLower = debouncedQuery.toLowerCase().trim();
      baseChats = baseChats.filter((chat) => {
        const titleMatch = chat.metadata.title
          ?.toLowerCase()
          .includes(searchLower);
        const participantMatch = chat.participants?.some((p) =>
          p.userId.username?.toLowerCase().includes(searchLower)
        );
        return titleMatch || participantMatch;
      });
    }

    return baseChats;
  }, [chats, debouncedQuery, selectedFilter]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {view === "main" && (
        <ChatFilters
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />
      )}

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20">
        {view === "main" && (
          <div className="space-y-1 px-2">
            {filteredChats?.map((chat) => (
              <ChatItem
                key={chat._id}
                chat={chat}
                onClick={() => setActiveChat(chat._id)}
              />
            ))}
            {filteredChats.length === 0 && (
              <div className="text-center text-muted-foreground p-4">
                No chats found.
                {debouncedQuery ? ` for "${debouncedQuery}"` : ""}
              </div>
            )}
          </div>
        )}
        {view === "new_message" && (
          <Suspense fallback={<div>Loading private chat...</div>}>
            <PrivateChat onClose={() => onViewChange("main")} />
          </Suspense>
        )}
        {view === "new_group" && (
          <Suspense fallback={<div>Loading group chat...</div>}>
            <GroupChat onClose={() => onViewChange("main")} />
          </Suspense>
        )}

        {view === "setting" && (
          <Suspense fallback={<div>Loading settings...</div>}>
            <Setting onClose={() => onViewChange("main")} />
          </Suspense>
        )}
      </div>

      {view === "theme_setting" && (
        <Suspense fallback={<div>Loading theme settings...</div>}>
          <ThemeSettingsPage onClose={() => onViewChange("main")} />
        </Suspense>
      )}
    </div>
  );
}
