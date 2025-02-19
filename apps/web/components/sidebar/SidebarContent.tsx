import { useMemo, useState } from "react";

import { useChatStore } from "@/store/useChatStore";
import { useDebounce } from "@/hooks/useDebounce";
import { ChatItem } from "../chat/ChatItem";
import { PrivateChat } from "./PrivateChat";
import { GroupChat } from "./GroupChat";
import ChatFilters from "./ChatFilter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuthStore from "@/store/useAuthStore";
import Setting from "./Setting";

type ViewType =
  | "main"
  | "search"
  | "new_message"
  | "new_group"
  | "new_channel"
  | "setting";

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
  const { chats, setActiveChat } = useChatStore();
  const [selectedFilter, setSelectedFilter] =
    useState<FilterOption["value"]>("all");
  const isLoading = false;
  const debouncedQuery = useDebounce(searchQuery, 300);

  const filteredChats = useMemo(() => {
    let baseChats = chats || [];

    switch (selectedFilter) {
      case "favorites":
        baseChats = baseChats.filter((chat) => chat.isFavorite);
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
        {view === "main" &&
          (isLoading ? (
            <div className="space-y-4 p-4">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    {/* <Skeleton className="h-12 w-12 rounded-full" /> */}
                    {/* <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[150px]" />
              </div>  */}
                  </div>
                ))}
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredChats?.map((chat) => (
                <ChatItem
                  key={chat._id}
                  chat={chat}
                  onClick={() => setActiveChat(chat._id)}
                />
              ))}
              {filteredChats.length === 0 && (
                <div className="text-center text-muted-foreground p-4">
                  No chats found
                  {debouncedQuery ? ` for "${debouncedQuery}"` : ""}
                </div>
              )}
            </div>
          ))}
        {view === "new_message" && (
          <PrivateChat onClose={() => onViewChange("main")} />
        )}
        {view === "new_group" && (
          <GroupChat onClose={() => onViewChange("main")} />
        )}

        {view === "setting" && <Setting onClose={() => onViewChange("main")} />}
      </div>
    </div>
  );
}
