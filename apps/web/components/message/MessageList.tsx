import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ArrowDownIcon, Loader2 } from "lucide-react";
import { TypingIndicator } from "../shared/TypingIndicator";
import { MessageBubble } from "./MessageBubble";
import { useChatStore } from "@/store/useChatStore";
import { useMessageStore } from "@/store/useMessageStore";
import useAuthStore from "@/store/useAuthStore";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { fetchMessages } from "@/hooks/useMessage";
import { useReadMessages } from "@/hooks/useReadMessage";

function MessageList() {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        setShowScrollButton(scrollTop + clientHeight < scrollHeight - 100);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleScrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const { user } = useAuthStore();
  const { activeChatId } = useChatStore();

  if (!activeChatId) return;

  const { messages } = useMessageStore();
  const { isLoading, error, hasMore, isLoadingMore, loadMore } =
    fetchMessages(activeChatId);

  const { isTyping } = useTypingIndicator(activeChatId);

  useReadMessages(activeChatId);

  const isOwnMessage = useCallback(
    (message: any) => {
      return (message.senderId?._id || message.senderId) === user?._id;
    },
    [user]
  );

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="h-[calc(100vh-160px)]" ref={containerRef}>
        <div className="space-y-4 p-4">
          {isLoading ? (
            <MessageLoader />
          ) : error ? (
            <MessageError error={error} />
          ) : (
            <MessagesContainer
              messages={messages[activeChatId] || []}
              isOwnMessage={isOwnMessage}
            />
          )}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>

      {isTyping && <TypingIndicator />}
      {showScrollButton && (
        <ScrollToBottomButton onClick={handleScrollToBottom} />
      )}
    </div>
  );
}

export function MessageLoader() {
  return (
    <div className="flex items-center justify-center h-20">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

interface MessageErrorProps {
  error: Error | string;
}

export function MessageError({ error }: MessageErrorProps) {
  return (
    <div className="text-red-500 text-sm text-center">
      {typeof error === "string"
        ? error
        : error.message || "Something went wrong."}
    </div>
  );
}

interface MessagesContainerProps {
  messages: any[];
  isOwnMessage: (message: any) => boolean;
}

export function MessagesContainer({
  messages,
  isOwnMessage,
}: MessagesContainerProps) {
  return (
    <>
      {messages.map((message) => (
        <MessageBubble
          key={message._id}
          message={message}
          isOwn={isOwnMessage(message)}
        />
      ))}
    </>
  );
}

interface ScrollToBottomButtonProps {
  onClick: () => void;
}

function ScrollToBottomButton({ onClick }: ScrollToBottomButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-[68px] right-4 p-2 bg-primary rounded-full border shadow-lg hover:bg-muted transition-colors duration-200"
    >
      <ArrowDownIcon className="h-6 w-6" />
    </button>
  );
}

export default MessageList;
