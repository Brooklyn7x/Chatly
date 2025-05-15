import { ScrollArea } from "@/components/ui/scroll-area";
import MessageItem from "./ChatMessage";
import { Button } from "@/components/ui/button";
import { ArrowDown, ChevronDown, Pin } from "lucide-react";
import { useFetchMessages } from "@/hooks/message/useMessage";
import { useChatStore } from "@/store/useChatStore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMessageStore } from "@/store/useMessageStore";
import useAuthStore from "@/store/useAuthStore";
import { Message } from "@/types";

const ChatMessages = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const userId = user?.id;

  const activeChatId = useChatStore((state) => state.activeChatId);
  const messages = useMessageStore(
    (state) => state.messages[activeChatId || ""]
  );
  const { isLoading, error, hasMore, loadMore } = useFetchMessages(
    activeChatId || ""
  );

  const isOwnMessage = useCallback(
    (message: Message) => message.senderId._id === userId,
    [user]
  );

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const bottomThreshold = 100;
    const isNearBottom =
      scrollHeight - (scrollTop + clientHeight) < bottomThreshold;
    setShowScrollButton(!isNearBottom);
  };

  useEffect(() => {
    const shouldAutoScroll = !showScrollButton;
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [messages, showScrollButton]);

  return (
    <>
      <div className="border-b bg-muted/40">
        <div className="px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-muted/50">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Pin size={14} />
            <span className="font-medium text-sm">pinned</span>
          </div>

          <Button variant="ghost" size="icon" className="h-6 w-6">
            <ChevronDown size={14} />
          </Button>
        </div>
      </div>
      <ScrollArea
        className="relative flex-1 p-4"
        ref={scrollAreaRef}
        onScroll={handleScroll}
      >
        <div className="flex flex-col space-y-4">
          {isLoading ? (
            <div className="flex flex-col space-y-4 h-full">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className={`flex ${index % 2 === 0 ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`animate-pulse p-3 rounded-lg w-64 h-16 ${index % 2 === 0 ? "bg-primary/30" : "bg-muted/50"}`}
                  />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-center">
                <p className="font-medium">Failed to load messages</p>
                <p className="text-sm mt-1">
                  Please check your connection and try again
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => loadMore()}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : messages?.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-muted-foreground">No messages yet</span>
              <span className="text-sm text-muted-foreground mt-1">
                Send a message to start the conversation
              </span>
            </div>
          ) : (
            messages?.map((m, index) => (
              <MessageItem key={index} message={m} isOwn={isOwnMessage(m)} />
            ))
          )}
          <div ref={messageEndRef} />
        </div>

        {showScrollButton && (
          <Button
            onClick={scrollToBottom}
            size="icon"
            variant="outline"
            className="fixed bottom-24 right-8 rounded-full shadow-lg hover:shadow-md transition-all duration-200"
          >
            <ArrowDown className="h-4 w-4" />
            <span className="sr-only">Scroll to bottom</span>
          </Button>
        )}
      </ScrollArea>
    </>
  );
};

export default ChatMessages;
