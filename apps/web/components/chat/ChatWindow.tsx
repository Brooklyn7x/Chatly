import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/useChatStore";
import { useUIStore } from "@/store/useUiStore";
import { useMessageStore } from "@/store/useMessageStore";
import { UserProfilePanel } from "../shared/UserProfilePanel";
import ChatHeader from "./ChatHeader";
import MessageList from "../message/MessageList";
import MessageInput from "../message/MessageInput";
import useAuth from "@/hooks/useAuth";
import socketService from "@/services/socket";
import useAuthStore from "@/store/useAuthStore";
import { TypingIndicator } from "../shared/TypingIndicator";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { useSocketChat } from "@/hooks/useSocket";
import { EmptyState } from "./EmptyChat";

export default function ChatWindow() {
  const { user } = useAuth();
  const { isMobile } = useUIStore();
  const { selectedChatId, chats } = useChatStore();
  const { getMessages, addMessage } = useMessageStore();
  const token = useAuthStore((state) => state.accessToken) || ``;
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const currentChat = chats.find((chat) => chat._id === selectedChatId);
  const messages = selectedChatId ? getMessages(selectedChatId) : [];
  const userId = user?._id;
  useSocketChat(token, selectedChatId, user);

  const { isTyping, handleTypingStart } = useTypingIndicator(
    currentChat,
    userId
  );

  const handleMessage = useCallback(
    (content: string) => {
      if (!content.trim() || !selectedChatId || !currentChat) return;

      const messageData = {
        _id: `${Date.now()}`,
        senderId: userId,
        conversationId: selectedChatId,
        content,
        type: "text",
        timestamp: new Date().toISOString(),
        conversationType: currentChat?.type as "direct" | "group",
        ...(currentChat?.type === "direct" && {
          receiverId: currentChat.participants.find((p) => p.userId !== userId)
            ?.userId,
        }),
      };

      addMessage(messageData);
      socketService.sendMessage(messageData);
    },
    [selectedChatId, currentChat, userId]
  );

  const toggleProfile = useCallback(() => {
    setIsProfileOpen((prev) => !prev);
  }, []);

  return (
    <div
      className={cn(
        "flex-1 flex flex-col",
        "bg-neutral-800/40",
        "transition-[transform,width] duration-300 ease-in-out",
        {
          "translate-x-full": isMobile && !selectedChatId,
          "translate-x-0": !isMobile || selectedChatId,
          "absolute inset-y-0 right-0 w-full z-10": isMobile,
          relative: !isMobile,
        }
      )}
    >
      {currentChat ? (
        <>
          <ChatHeader onProfileClick={toggleProfile} chat={currentChat} />

          <MessageList messages={messages} currentUserId={userId} />

          {isTyping && <TypingIndicator />}

          <MessageInput
            onSendMessage={handleMessage}
            onTypingStart={handleTypingStart}
          />

          {isProfileOpen && (
            <UserProfilePanel
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
              currentChat={currentChat}
            />
          )}
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
