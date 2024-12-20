import { useState } from "react";
import { useChatStore } from "@/store/useChatStore";
import { UserProfilePanel } from "../interface/UserProfilePanel";
import ChatHeader from "./ChatHeader";
import MessageList from "../message/MessageList";
import MessageInput from "../message/MessageInput";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUiStore";

export default function ChatArea() {
  const { isMobile } = useUIStore();
  const { selectedChatId, chats, sendMessage } = useChatStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const currentChat = chats.find((chat) => chat.id === selectedChatId);

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!selectedChatId || !content.trim()) return;
    try {
      await sendMessage(selectedChatId, content);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  return (
    <div
      className={cn(
        "flex-1 flex flex-col",
        "transition-[transform,width] duration-300 ease-in-out",
        isMobile && !selectedChatId ? "translate-x-full" : "translate-x-0",
        isMobile ? "absolute inset-y-0 right-0 w-full z-10" : "relative"
      )}
    >
      <ChatHeader
        onProfileClick={() => setIsProfileOpen(!isProfileOpen)}
        user={currentChat?.participants[0]}
      />

      <MessageList
        messages={currentChat?.messages}
        currentUserId={useChatStore.getState().currentUser?.id || ""}
      />

      <MessageInput onSendMessage={handleSendMessage} />

      {isProfileOpen && (
        <UserProfilePanel
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
}
