import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/useChatStore";
import { useUIStore } from "@/store/useUiStore";
import { ChatInfo } from "./ChatInfo";
import { TypingIndicator } from "../shared/TypingIndicator";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import ChatHeader from "./ChatHeader";
import MessageList from "../message/MessageList";
import MessageInput from "../message/MessageInput";
import useAuthStore from "@/store/useAuthStore";
import { useMessages } from "@/hooks/useMessages";
import { useGroupSocket } from "@/hooks/useGroupSocket";
import { useChats } from "@/hooks/useChats";

import React from "react";
import { Loader2 } from "lucide-react";

export default function ChatWindow() {
  const [showChatInfo, setShowChatInfo] = useState(false);
  const { user } = useAuthStore();
  const { isMobile } = useUIStore();
  const { activeChatId } = useChatStore();
  const { messages, isLoading, error } = useMessages(activeChatId || "");
  const { isTyping } = useTypingIndicator(activeChatId, user?._id);

  const toggleProfile = useCallback(() => {
    setShowChatInfo((prev) => !prev);
  }, []);

  if (!activeChatId) {
    return (
      <div className="h-full w-auto flex items-center justify-center bg-neutral-900/5">
        <div className="text-center p-6">
          <h3 className="text-xl font-medium mb-3 text-muted-foreground">
            Select a chat to start messaging
          </h3>
          <p className="text-gray-600">
            Choose from your existing conversations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full",
        "bg-background",
        "transition-transform duration-300",
        {
          "fixed inset-0 z-50": isMobile,
          "relative flex-1": !isMobile,
          "translate-x-full": isMobile && !activeChatId,
          "translate-x-0 pl-[420px]": !isMobile || activeChatId,
        }
      )}
    >
      <ChatHeader />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 w-full max-w-4xl mx-auto px-4 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-sm p-4 text-center">{error}</div>
          ) : (
            <>
              <MessageList />
              {isTyping && (
                <div className="py-2">
                  <TypingIndicator />
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex-shrink-0">
          <div className="max-w-4xl mx-auto w-full">
            <MessageInput />
          </div>
        </div>
      </div>

      {showChatInfo && <ChatInfo />}
    </div>
  );
}
