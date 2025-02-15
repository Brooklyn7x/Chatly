import { useMemo } from "react";

import { useChatStore } from "@/store/useChatStore";
import { useDebounce } from "@/hooks/useDebounce";
import { ChatItem } from "../chat/ChatItem";
import { PrivateChat } from "./PrivateChat";
import { GroupChat } from "./GroupChat";
type ViewType = "main" | "search" | "new_message" | "new_group" | "new_channel";
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
  const isLoading = false;
  const debouncedQuery = useDebounce(searchQuery, 300);

  const filteredChats = useMemo(() => {
    if (!debouncedQuery.trim()) return chats || [];

    const searchLower = debouncedQuery.toLowerCase().trim();

    return (chats || []).filter((chat) => {
      if (chat.metadata.title?.toLowerCase().includes(searchLower)) {
        return true;
      }

      if (
        chat.participants?.some((p) =>
          p.userId.username?.toLowerCase().includes(searchLower)
        )
      ) {
        return true;
      }

      return false;
    });
  }, [chats, debouncedQuery]);

  return (
    <div className="flex-1 overflow-y-auto">
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
          </div>
        ))}
      {view === "new_message" && (
        <PrivateChat onClose={() => onViewChange("main")} />
      )}
      {view === "new_group" && (
        <GroupChat onClose={() => onViewChange("main")} />
      )}
    </div>
  );
}
