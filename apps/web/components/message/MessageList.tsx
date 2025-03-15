import { useCallback, useEffect, useMemo } from "react";
import { ArrowDownIcon, Loader2 } from "lucide-react";
import { TypingIndicator } from "../shared/TypingIndicator";
import { MessageBubble } from "./MessageBubble";
import { useChatStore } from "@/store/useChatStore";
import { useMessageStore } from "@/store/useMessageStore";
import useAuthStore from "@/store/useAuthStore";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { getMessages } from "@/hooks/useMessage";
import { useMessage } from "@/hooks/useMessage";
import { useScrollBehavior } from "@/hooks/useScroll";

function MessageList() {
  const { user } = useAuthStore();
  const { activeChatId } = useChatStore();
  const { isNearBottom, scrollContainerRef, scrollToBottom } =
    useScrollBehavior();
  const { markAsRead } = useMessage(activeChatId || "");
  const { isTyping } = useTypingIndicator(activeChatId || "");
  const { isLoading, error } = getMessages(activeChatId || "");
  const { messages } = useMessageStore();

  const unReadMessages = useMemo(() => {
    return messages[activeChatId || ""]?.filter(
      (message: any) =>
        message.status !== "read" &&
        message.senderId?._id !== user?._id &&
        !message._id.startsWith("temp-")
    );
  }, [messages, activeChatId, user?._id]);

  const messageIds = useMemo(() => {
    return unReadMessages?.map((message: any) => message._id) || [];
  }, [unReadMessages]);

  useEffect(() => {
    if (messageIds?.length > 0) {
      markAsRead(messageIds);
    }
  }, [messages]);

  const isOwnMessage = useCallback(
    (message: any) => {
      return (message.senderId?._id || message.senderId) === user?._id;
    },
    [user]
  );

  const handleScrollToBottom = useCallback(() => {
    if (isNearBottom) {
      scrollToBottom();
    }
  }, [isNearBottom, scrollToBottom]);

  if (!activeChatId) return null;

  return (
    <div className="flex flex-col h-full">
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 pb-20"
      >
        <div className="space-y-4">
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
        <div ref={scrollContainerRef} />
      </div>

      {isTyping && <TypingIndicator />}
      {!isNearBottom && <ScrollToBottomButton onClick={handleScrollToBottom} />}
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
    <div className="text-red-500 text-sm p-4 text-center">
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
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageBubble
          key={message._id}
          message={message}
          isOwn={isOwnMessage(message)}
        />
      ))}
    </div>
  );
}

interface ScrollToBottomButtonProps {
  onClick: () => void;
}
function ScrollToBottomButton({ onClick }: ScrollToBottomButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 p-2 bg-primary rounded-full border shadow-lg hover:bg-muted transition-colors duration-200"
    >
      <ArrowDownIcon className="h-6 w-6" />
    </button>
  );
}

export default MessageList;
