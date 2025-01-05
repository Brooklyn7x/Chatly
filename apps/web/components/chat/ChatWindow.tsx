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
  const { getMessages, addMessage } = useMessageStore();
  const chatMessages = selectedChatId ? getMessages(selectedChatId) : [];
  const [messages, setMessages] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const currentChat = chats.find((chat) => chat._id === selectedChatId);
  const token = useAuthStore((state) => state.accessToken) || ``;

  useEffect(() => {
    if (!token || !selectedChatId) return;

    socketService.connect(token);
    const unsubscribeMessage = socketService.onMessageReceived((message) => {
      console.log("Message received:", message);

      const formattedMessage = {
        ...message._doc,
        timestamp: new Date(message._doc.timestamp),
        sender: {
          userId: message._doc.senderId,
          timestamp: new Date(),
        },
      };
      setMessages((prev) => [...prev, message._doc]);
      addMessage(formattedMessage);
    });

    const unsubscribeTyping = socketService.onTypingUpdate((data) => {
      if (currentChat?.participants.some((p) => p.userId === data.userId)) {
        console.log("Typing update:", data);
      }
    });

    return () => {
      unsubscribeMessage();
      unsubscribeTyping();
      socketService.disconnect();
    };
  }, [token, user?._id]);

  const recipient = currentChat?.participants.find(
    (participant) => participant?.userId !== user?._id
  );

  const handleMessage = (content: string) => {
    if (!content.trim()) return;
    const messageData = {
      senderId: user?._id,
      conversationId: selectedChatId,
      content,
      type: "text",
      timestamp: new Date().toISOString(),
      ...(currentChat?.type === "direct" && {
        receiverId: currentChat.participants.find((p) => p.userId !== user?._id)
          ?.userId,
      }),
    };
    addMessage(messageData);
    setMessages((prev) => [...prev, messageData]);
    socketService.sendMessage(messageData);
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
        "flex-1 flex flex-col",
        "bg-neutral-800/40",
        "transition-[transform,width] duration-300 ease-in-out",
        isMobile && !selectedChatId ? "translate-x-full" : "translate-x-0",
        isMobile ? "absolute inset-y-0 right-0 w-full z-10" : "relative"
      )}
    >
      {currentChat ? (
        <>
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
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">
            Select a chat to start messaging
          </p>
        </div>
      )}
    </div>
  );
}
