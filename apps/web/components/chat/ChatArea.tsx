import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/useChatStore";
import { useUIStore } from "@/store/useUiStore";
import { useMessageStore } from "@/store/useMessageStore";
import { UserProfilePanel } from "../interface/UserProfilePanel";
import ChatHeader from "./ChatHeader";
import MessageList from "../message/MessageList";
import MessageInput from "../message/MessageInput";
import useAuth from "@/hooks/useAuth";
import socketService from "@/services/socket";
import useAuthStore from "@/store/useUserStore";

export default function ChatArea() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useAuth();
  const { isMobile } = useUIStore();
  const { selectedChatId, chats } = useChatStore();
  const { sendMessage, getMessages } = useMessageStore();
  console.log(user?._id, "user?.id");
  const currentChat = chats.find((chat) => chat.id === selectedChatId);
  const chatMessages = selectedChatId ? getMessages(selectedChatId) : [];
  const token = useAuthStore((state) => state.accessToken) || ``;
  useEffect(() => {
    socketService.connect(token);
    socketService.onMessageReceived((message) => {
      console.log("Message received:", message);
    });
    socketService.onTypingUpdate((data) => {
      console.log("Typing update:", data);
    });

    return () => {
      socketService.disconnect();
    };
  }, [token, user?._id]);

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!selectedChatId || !content.trim()) return;
    try {
      await sendMessage(selectedChatId, content, "text");
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

      <MessageList messages={chatMessages} currentUserId={user?.id || ""} />

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
