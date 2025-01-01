import { useEffect, useState } from "react";
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

export default function ChatWindow() {
  const { user } = useAuth();
  const { isMobile } = useUIStore();
  const { selectedChatId, chats } = useChatStore();
  const { getMessages } = useMessageStore();
  const chatMessages = selectedChatId ? getMessages(selectedChatId) : [];
  const [messages, setMessages] = useState(chatMessages);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const currentChat = chats.find((chat) => chat.id === selectedChatId);
  const token = useAuthStore((state) => state.accessToken) || ``;

  useEffect(() => {
    socketService.connect(token);
    socketService.onMessageReceived((message) => {
      setMessages((prevMessages) => [...prevMessages, message._doc]);
    });
    socketService.onTypingUpdate((data) => {
      console.log("Typing update:", data);
    });
    return () => {
      socketService.disconnect();
    };
  }, [token, user?._id]);

  const recipient = currentChat?.participants.find(
    (participant) => participant?.userId !== user?._id
  );

  const handleMessage = (content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      senderId: user?._id,
      receiverId: recipient.userId,
      conversationId: selectedChatId,
      content,
      type: "text",
      timestamp: new Date().toISOString(),
      status: "sent",
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    socketService.sendMessage(newMessage);
  };

  const handleTypingStart = () => {
    socketService.startTyping(recipient);
  };

  const handleTypingStop = () => {
    socketService.stopTyping(recipient);
  };

  return (
    <div
      className={cn(
        "bg-neutral-800/40",
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

      <MessageList messages={messages} currentUserId={user?._id} />

      <MessageInput
        onSendMessage={handleMessage}
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
      />

      {isProfileOpen && (
        <UserProfilePanel
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          currentChat={currentChat}
        />
      )}
    </div>
  );
}
