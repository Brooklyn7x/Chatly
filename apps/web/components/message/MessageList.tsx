import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { TypingIndicator } from "../shared/TypingIndicator";
import { MessageBubble } from "./MessageBubble";
import { useChatStore } from "@/store/useChatStore";
import { useMessageStore } from "@/store/useMessageStore";
import useAuthStore from "@/store/useAuthStore";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { useFetchMessages } from "@/hooks/useMessage";
import { Message } from "@/types";

function MessageList() {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);
  const activeChatId = useChatStore((state) => state.activeChatId);
  const messages = useMessageStore((state) => state.messages);
  const { isLoading, error } = useFetchMessages(activeChatId || "");
  const { isTyping } = useTypingIndicator(activeChatId || "");
  const prevMessagesLengthRef = useRef(0);
  const currentMessages = messages[activeChatId || ""] || [];

  const lastMessage =
    currentMessages.length > 0
      ? currentMessages[currentMessages.length - 1]
      : null;
  const isLastMessageMine = lastMessage
    ? lastMessage.senderId._id === user?.id
    : false;

  const getScrollableElement = useCallback(() => {
    const scrollAreaViewport = document.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (scrollAreaViewport) return scrollAreaViewport as HTMLElement;

    if (containerRef.current) return containerRef.current;

    return null;
  }, []);

  useEffect(() => {
    if (activeChatId) {
      setIsAtBottom(true);
      prevMessagesLengthRef.current = 0;
      setTimeout(scrollToBottom, 100);
    }
  }, [activeChatId]);

  useEffect(() => {
    if (!currentMessages.length) return;

    const messagesLength = currentMessages.length;
    const isNewMessage = messagesLength > prevMessagesLengthRef.current;

    if (isNewMessage) {
      if (isLastMessageMine || isAtBottom) {
        setTimeout(scrollToBottom, 50);
      }
    }

    prevMessagesLengthRef.current = messagesLength;
  }, [currentMessages.length, isLastMessageMine, isAtBottom]);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setIsAtBottom(true);
      return;
    }

    const scrollableElement = getScrollableElement();
    if (scrollableElement) {
      scrollableElement.scrollTop = scrollableElement.scrollHeight;
      setIsAtBottom(true);
    }
  }, [getScrollableElement]);

  const isOwnMessage = useCallback(
    (message: Message) => {
      return message.senderId._id === user?.id;
    },
    [user]
  );

  if (!activeChatId) return null;

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="h-[calc(100vh-160px)]" ref={containerRef}>
        <div className="space-y-4 p-4">
          {isLoading ? (
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
    <div className="flex items-center justify-center h-20">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No messages yet. Start the conversation!
      </div>
    );
  }

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

export default MessageList;

interface MessageErrorProps {
  error: Error | string;
}

export function MessageError({ error }: MessageErrorProps) {
  return (
    <div className="text-red-500 text-sm text-center">
      {typeof error === "string"
        ? error
        : error.message || "Something went wrong. Failed to fetch messages"}
    </div>
  );
}
