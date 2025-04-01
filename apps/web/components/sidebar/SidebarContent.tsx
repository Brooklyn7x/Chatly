import { useMemo, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useChatStore } from "@/store/useChatStore";
import { useDebounce } from "@/hooks/useDebounce";
import ChatFilters from "./ChatFilter";
import { ViewType } from "@/types";
import SidebarHeader from "./SidebarHeader";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { useFetchChats } from "@/hooks/useChats";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ChatList } from "../chat/ChatList";
import ContactPage from "./Contacts";

const FBActionButton = dynamic(() => import("./FloatingActionButton"), {
  ssr: false,
  loading: () => (
    <Button className="h-14 w-14">
      <Pencil className="h-6 w-6" />
    </Button>
  ),
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
  const { isLoading, error } = useFetchChats();
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

  const renderMainView = () => {
    if (error) {
      return (
        <div className="flex flex-col h-full">
          <SidebarHeader
            view={view}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onViewChange={onViewChange}
          />
          <div className="pt-4 px-2">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load chats. Please try again later.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

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
        <ScrollArea className="h-[calc(100vh-130px)]">
          <div className="space-y-1">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
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
