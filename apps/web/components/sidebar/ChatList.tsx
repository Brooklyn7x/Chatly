import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import { Chat } from "@/types";
import ChatItem from "./ChatItem";
import { useChatStore } from "@/store/useChatStore";

interface ChatListProps {
  isLoading: boolean;
  pinnedChats: Chat[];
  unpinnedChats: Chat[];
  onTogglePin: (chatId: string, event: React.MouseEvent) => void;
}

const ChatList = ({
  isLoading,
  pinnedChats,
  unpinnedChats,
  onTogglePin,
}: ChatListProps) => {
  const setActiveChat = useChatStore((state) => state.setActiveChat);
  const activeChatId = useChatStore((state) => state.activeChatId);

  return (
    <ScrollArea className="h-[calc(100vh-150px)] overflow-y-auto">
      {isLoading ? (
        Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4 p-2">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))
      ) : pinnedChats.length === 0 && unpinnedChats.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-1/2 text-muted-foreground">
          <p className="text-base">No chats found</p>
          <p className="text-sm">Start a new conversation!</p>
        </div>
      ) : (
        <>
          {pinnedChats.length > 0 && (
            <div className="divide-y">
              {pinnedChats.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  onSelectChat={setActiveChat}
                  isActive={activeChatId === chat.id}
                  isPinned={true}
                  onTogglePin={onTogglePin}
                />
              ))}
            </div>
          )}

          {unpinnedChats.length > 0 && (
            <div className="divide-y">
              {unpinnedChats.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  onSelectChat={setActiveChat}
                  isActive={activeChatId === chat.id}
                  isPinned={false}
                  onTogglePin={onTogglePin}
                />
              ))}
            </div>
          )}
        </>
      )}
    </ScrollArea>
  );
};

export default ChatList;
