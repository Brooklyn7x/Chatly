import { useMemo, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useChatStore } from "@/store/useChatStore";
import { useDebounce } from "@/hooks/useDebounce";
import { ChatItem } from "../chat/ChatItem";
import ChatFilters from "./ChatFilter";
import { ViewType } from "@/types";
import SidebarHeader from "./SidebarHeader";

const PrivateChat = dynamic(() => import("./PrivateChat"), { ssr: false });
const GroupChat = dynamic(() => import("./CreateGroupChat"), { ssr: false });
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
  onViewChange: (view: ViewType) => void;
}

export default function SidebarContent({
  view,
  onViewChange,
}: SidebarContentProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
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

    if (debouncedQuery?.trim()) {
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

  const renderMainView = () => (
    <>
      <SidebarHeader
        view={view}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onViewChange={onViewChange}
      />
      <ChatFilters
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />
      <ScrollArea className="h-[calc(100vh-130px)]">
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
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </>
  );

  const renderView = () => {
    switch (view) {
      case "new_message":
        return (
          <Suspense fallback={<div>Loading private chat...</div>}>
            <PrivateChat onClose={() => onViewChange("main")} />
          </Suspense>
        );
      case "new_group":
        return (
          <Suspense fallback={<div>Loading group chat...</div>}>
            <GroupChat onClose={() => onViewChange("main")} />
          </Suspense>
        );
      case "setting":
        return (
          <Suspense fallback={<div>Loading settings...</div>}>
            <Setting onClose={() => onViewChange("main")} />
          </Suspense>
        );
      case "theme_setting":
        return (
          <Suspense fallback={<div>Loading theme settings...</div>}>
            <ThemeSettingsPage onClose={() => onViewChange("main")} />
          </Suspense>
        );
      default:
        return renderMainView();
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">{renderView()}</div>
  );
}
