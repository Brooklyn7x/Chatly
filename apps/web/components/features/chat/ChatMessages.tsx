import { useMemo, useRef, useEffect } from "react";
import { Message } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { useChatStore } from "@/store/useChatStore";
import { formatMessageTimestamp } from "@/utils/dateUtils";
import { UserAvatar } from "@/components/common/UserAvatar";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import TypingIndicator from "./TypingIndicator";

interface ChatMessagesProps {
  chatId: string;
}

// Helper function to validate message object
const isValidMessage = (message: any): message is Message => {
  return (
    message &&
    typeof message === "object" &&
    (message._id || message.id) &&
    message.conversationId &&
    message.senderId &&
    typeof message.senderId === "object" &&
    (message.senderId._id || message.senderId.id) &&
    typeof message.content === "string"
  );
};

// Helper function to get safe message ID
const getMessageId = (message: Message): string => {
  return message._id || message.id || `msg-${Date.now()}`;
};

// Helper function to get safe sender ID
const getSenderId = (message: Message): string => {
  return message.senderId._id || message.senderId.id || "";
};

const ChatMessages = ({ chatId }: ChatMessagesProps) => {
  const { user } = useAppStore();
  const { messages } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Safely get and validate messages
  const chatMessages = useMemo(() => {
    if (!chatId || !messages || typeof messages !== "object") {
      return [];
    }

    const rawMessages = messages[chatId];

    if (!Array.isArray(rawMessages)) {
      return [];
    }

    // Filter out invalid messages and sort by creation time
    return rawMessages.filter(isValidMessage).sort((a, b) => {
      const aTime = new Date(a.createdAt || 0).getTime();
      const bTime = new Date(b.createdAt || 0).getTime();
      return aTime - bTime;
    });
  }, [chatId, messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p>Select a chat to start messaging</p>
      </div>
    );
  }

  if (chatMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
      <div className="space-y-4">
        {chatMessages.map((message) => {
          try {
            const messageId = getMessageId(message);
            const senderId = getSenderId(message);
            const isOwn = senderId === user?.id || senderId === user?._id;

            return (
              <div
                key={messageId}
                className={cn("flex gap-3 group", isOwn && "flex-row-reverse")}
              >
                <UserAvatar
                  user={message.senderId}
                  size="sm"
                  className="flex-shrink-0"
                />
                <div
                  className={cn("max-w-[70%] space-y-1", isOwn && "items-end")}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2 text-sm",
                      isOwn
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-muted"
                    )}
                  >
                    {message.isDeleted ? (
                      <em className="text-muted-foreground">
                        This message was deleted
                      </em>
                    ) : (
                      <>
                        <p className="whitespace-pre-wrap break-words">
                          {message.content || ""}
                        </p>
                        {message.isEdited && (
                          <span className="text-xs opacity-70 ml-2">
                            (edited)
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <div
                    className={cn(
                      "text-xs text-muted-foreground px-2",
                      isOwn && "text-right"
                    )}
                  >
                    {formatMessageTimestamp(message.createdAt || new Date())}
                  </div>
                </div>
              </div>
            );
          } catch (error) {
            console.error("Error rendering message:", error, message);
            return null; // Skip problematic messages
          }
        })}
      </div>

      {/* Typing Indicator */}
      <TypingIndicator chatId={chatId} />
    </ScrollArea>
  );
};

export default ChatMessages;
