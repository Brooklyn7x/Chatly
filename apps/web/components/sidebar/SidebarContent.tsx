import {
  useMemo,
  useState,
  useEffect,
  useRef,
  Suspense,
  useCallback,
} from "react";
import dynamic from "next/dynamic";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useChatStore } from "@/store/useChatStore";
import { useDebounce } from "@/hooks/useDebounce";
import ChatFilters from "./ChatFilter";
import { ViewType } from "@/types";
import SidebarHeader from "./SidebarHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatList } from "../chat/ChatList";
import ContactPage from "./Contacts";
import { useFetchChats } from "@/hooks/useChats";

const FBActionButton = dynamic(() => import("./FloatingActionButton"), {
  ssr: false,
});
const CreatePrivateChat = dynamic(() => import("./CreatePrivateChat"), {
  ssr: false,
});
const CreateGroupChat = dynamic(() => import("./CreateGroup"), {
  ssr: false,
});
const Setting = dynamic(() => import("./Setting"), { ssr: false });

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
  const [selectedFilter, setSelectedFilter] =
    useState<FilterOption["value"]>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { isLoading, loadMore, hasMore } = useFetchChats();

  const { setActiveChat, chats } = useChatStore();

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
        baseChats = baseChats.filter((chat) => chat.type === "private");
        break;
      case "channel":
        baseChats = baseChats.filter((chat) => chat.type === "channel");
        break;
    }

    if (debouncedQuery?.trim()) {
      const searchLower = debouncedQuery.toLowerCase().trim();
      baseChats = baseChats.filter((chat) => {
        const titleMatch = chat.name?.toLowerCase().includes(searchLower);
        const participantMatch = chat.participants?.some((p) =>
          p.userId.username?.toLowerCase().includes(searchLower)
        );
        return titleMatch || participantMatch;
      });
    }

    return baseChats;
  }, [chats, debouncedQuery, selectedFilter]);

  const getScrollableElement = useCallback((): HTMLElement | null => {
    if (containerRef.current) {
      const viewport = containerRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      ) as HTMLElement;
      return viewport || containerRef.current;
    }
    return null;
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || isLoading) return;
    const scrollable = getScrollableElement();
    if (!scrollable) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore && !isLoading) {
            loadMore();
          }
        });
      },
      {
        root: scrollable,
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [getScrollableElement, hasMore, isLoading, loadMore]);

  const renderMainView = () => {
    return (
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
        <ScrollArea className="h-[calc(100vh-130px)]" ref={containerRef}>
          <div className="space-y-1">
            {isLoading && chats.length === 0 ? (
              Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4 p-2">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              ))
            ) : (
              <>
                {filteredChats.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    {searchQuery
                      ? "No chats match your search"
                      : "No chats available"}
                  </div>
                )}
                <ChatList
                  chats={filteredChats}
                  onSelectChat={(chatId) => setActiveChat(chatId)}
                />

                <div ref={sentinelRef} style={{ height: "1px" }} />
                {isLoading && (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                )}
              </>
            )}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        <FBActionButton onViewChange={onViewChange} />
      </>
    );
  };

  const renderView = () => {
    switch (view) {
      case "new_message":
        return (
          <Suspense fallback={<div>Loading private chat...</div>}>
            <CreatePrivateChat onClose={() => onViewChange("main")} />
          </Suspense>
        );
      case "new_group":
        return (
          <Suspense fallback={<div>Loading group chat...</div>}>
            <CreateGroupChat onClose={() => onViewChange("main")} />
          </Suspense>
        );
      case "setting":
        return (
          <Suspense fallback={<div>Loading settings...</div>}>
            <Setting onClose={() => onViewChange("main")} />
          </Suspense>
        );
      case "contacts":
        return <ContactPage onClose={() => onViewChange("main")} />;
      default:
        return renderMainView();
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">{renderView()}</div>
  );
}
