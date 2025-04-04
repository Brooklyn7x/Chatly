"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TypingIndicator } from "../shared/TypingIndicator";
import { MessageBubble } from "./MessageBubble";
import { useChatStore } from "@/store/useChatStore";
import { useMessageStore } from "@/store/useMessageStore";
import useAuthStore from "@/store/useAuthStore";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { useFetchMessages } from "@/hooks/useMessage";
import { Message } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

function MessageList() {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);
  const activeChatId = useChatStore((state) => state.activeChatId);
  const messages = useMessageStore((state) => state.messages);
  const { isLoading, error, hasMore, loadMore } = useFetchMessages(
    activeChatId || ""
  );
  const { isTyping } = useTypingIndicator(activeChatId || "");
  const currentMessages = messages[activeChatId || ""] || [];
  const unreadMessage = currentMessages.filter(
    (message) => message.status !== "read"
  );

  console.log(unreadMessage);

  const getScrollableElement = useCallback((): HTMLElement | null => {
    if (containerRef.current) {
      const viewport = containerRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      ) as HTMLElement;
      return viewport || containerRef.current;
    }
    return null;
  }, []);

  const scrollToBottom = useCallback(() => {
    const scrollable = getScrollableElement();
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setIsAtBottom(true);
    } else if (scrollable) {
      scrollable.scrollTop = scrollable.scrollHeight;
      setIsAtBottom(true);
    }
  }, [getScrollableElement]);

  useEffect(() => {
    if (activeChatId) {
      setIsAtBottom(true);
      setTimeout(scrollToBottom, 100);
    }
  }, [activeChatId, scrollToBottom]);

  const prevMessagesLengthRef = useRef(0);
  useEffect(() => {
    if (!currentMessages.length) return;
    const messagesLength = currentMessages.length;
    const isNewMessage = messagesLength > prevMessagesLengthRef.current;
    if (isNewMessage && isAtBottom) {
      setTimeout(scrollToBottom, 50);
    }
    prevMessagesLengthRef.current = messagesLength;
  }, [currentMessages.length, isAtBottom, scrollToBottom]);

  useEffect(() => {
    const sentinel = topSentinelRef.current;
    if (!sentinel || !hasMore || isLoading) return;

    const scrollable = getScrollableElement();
    if (!scrollable) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore && !isLoading) {
            const prevScrollHeight = scrollable.scrollHeight;
            const prevScrollTop = scrollable.scrollTop;

            (async () => {
              try {
                await loadMore();
                const newScrollHeight = scrollable.scrollHeight;
                const diff = newScrollHeight - prevScrollHeight;

                scrollable.scrollTop = prevScrollTop + diff;
              } catch (err) {
                console.error("Error loading more messages:", err);
              }
            })();
          }
        });
      },
      { root: scrollable, threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [getScrollableElement, hasMore, isLoading, loadMore]);

  const isOwnMessage = useCallback(
    (message: Message) => message.senderId._id === user?.id,
    [user]
  );

  if (!activeChatId) return null;

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="h-[calc(100vh-160px)]" ref={containerRef}>
        <div className="space-y-4 p-4">
          <div ref={topSentinelRef} style={{ height: "1px" }} />
          {isLoading && currentMessages.length === 0 ? (
            <MessageLoader />
          ) : error ? (
            <MessageError error={error} />
          ) : (
            <>
              <MessagesContainer
                messages={currentMessages}
                isOwnMessage={isOwnMessage}
              />
              <div ref={messagesEndRef} style={{ height: "1px" }} />
            </>
          )}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      {isTyping && <TypingIndicator />}
    </div>
  );
}

export function MessageLoader() {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface MessagesContainerProps {
  messages: Message[];
  isOwnMessage: (message: Message) => boolean;
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

interface MessageErrorProps {
  error: Error | string;
}
export function MessageError({ error }: MessageErrorProps) {
  const errorMessage =
    typeof error === "string"
      ? error
      : error && error.message
        ? error.message
        : "Something went wrong. Please try again.";

  return (
    <div className="p-4 text-center text-red-600 bg-red-100 border border-red-300 rounded">
      {errorMessage}
    </div>
  );
}
export default MessageList;
