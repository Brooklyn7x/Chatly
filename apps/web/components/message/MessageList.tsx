import { useEffect, useRef, useState } from "react";
import { ArrowDownIcon, Loader2 } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { useMessages } from "@/hooks/useMessages";
import { useChatStore } from "@/store/useChatStore";
import useAuthStore from "@/store/useAuthStore";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { TypingIndicator } from "../shared/TypingIndicator";

export default function MessageList() {
  const [isNearBottom, setIsNearBottom] = useState(true);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const { activeChatId } = useChatStore();
  const { messages, isLoading, error } = useMessages(activeChatId || "");
  const { isTyping } = useTypingIndicator(activeChatId || "");
  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (isNearBottom) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollHeight, scrollTop, clientHeight } =
          scrollContainerRef.current;
        const nearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setIsNearBottom(nearBottom);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-sm p-4 text-center">{error}</div>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                isOwn={(message.senderId?._id || message.senderId) === user?._id}
              />
            ))
          )}
        </div>
        <div ref={messageEndRef} />
      </div>

      {isTyping && (
        <div className="sticky bottom-0 py-2">
          <TypingIndicator />
        </div>
      )}

      {!isNearBottom && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-4 right-4 p-2 bg-black rounded-full border bg-primary"
        >
          <ArrowDownIcon className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
