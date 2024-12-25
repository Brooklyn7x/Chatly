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
  const { user } = useAuth();
  const { isMobile } = useUIStore();
  const { selectedChatId, chats } = useChatStore();
  const { getMessages, addMessage } = useMessageStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const currentChat = chats.find((chat) => chat.id === selectedChatId);
  const chatMessages = selectedChatId ? getMessages(selectedChatId) : [];
  const token = useAuthStore((state) => state.accessToken) || ``;

  useEffect(() => {
    socketService.connect(token);
    socketService.onMessageReceived((message) => {
      console.log(message);
      addMessage(message._doc);
    });
    socketService.onTypingUpdate((data) => {
      console.log("Typing update:", data);
    });
    return () => {
      socketService.disconnect();
    };
  }, [token, user?._id]);

  const handleMessage = (content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      senderId: user?._id,
      receiverId: currentChat?.participants[0]?.userId || "",
      conversationId: selectedChatId || "",
      content,
      type: "text",
      timestamp: new Date().toISOString(),
      status: "sent",
    };
    socketService.sendMessage(newMessage);
    addMessage(newMessage);
  };

  const handleTyping = () => {
    socketService.startTyping(currentChat?.participants[0]?.userId);
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
        chat={currentChat}
      />

      <MessageList messages={chatMessages} currentUserId={user?.id || ""} />

      <MessageInput onSendMessage={handleMessage} onTyping={handleTyping} />

      {isProfileOpen && (
        <UserProfilePanel
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
}
