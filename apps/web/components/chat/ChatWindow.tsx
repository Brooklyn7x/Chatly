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
  const messages = selectedChatId ? getMessages(selectedChatId) : [];
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const currentChat = chats.find((chat) => chat._id === selectedChatId);
  const token = useAuthStore((state) => state.accessToken) || ``;
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  console.log(user?._id, "ctte");
  useEffect(() => {
    if (!token || !selectedChatId) return;
    socketService.connect(token);
    const messageSet = new Set();
    const unsubscribeMessage = socketService.onMessageReceived((message) => {
      console.log("Received Message", message);
      const messageId = message._id;
      if (!messageSet.has(messageId)) {
        messageSet.add(messageId);
        const formattedMessage = {
          _id: message._id,
          conversationId: message._doc.conversationId,
          conversationType: message.conversationType,
          content: message._doc.content,
          type: message._doc.type,
          senderId: message._doc.senderId,
          receiverId: message._doc.receiverId,
          timestamp: new Date(message._doc.timestamp).toISOString(),
          sender: {
            userId: message._doc.senderId,
            timestamp: new Date().toISOString(),
          },
        };
        addMessage(formattedMessage);
      }
    });

    const unsubscribeTyping = socketService.onTypingUpdate((data) => {
      console.log(data, "typing data");
      if (
        data.userId !== user?._id &&
        currentChat?.participants.some((p) => p.userId === data.userId)
      ) {
        setIsTyping(true);
        if (typingTimeout) clearTimeout(typingTimeout);
        const newTimeout = setTimeout(() => setIsTyping(false), 2000);
        setTypingTimeout(newTimeout);
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
    if (!content.trim() || !selectedChatId || !currentChat) return;

    const messageData = {
      _id: `${Date.now()}`,
      senderId: user?._id,
      conversationId: selectedChatId,
      content,
      type: "text",
      timestamp: new Date().toISOString(),
      conversationType: currentChat?.type as "direct" | "group",
      ...(currentChat?.type === "direct" && {
        receiverId: currentChat.participants.find((p) => p.userId !== user?._id)
          ?.userId,
      }),
    };

    addMessage(messageData);
    socketService.sendMessage(messageData);
  };

  const handleTypingStart = () => {
    if (!isTyping) {
      socketService.startTyping(recipient?.userId);
    }
    if (typingTimeout) clearTimeout(typingTimeout);
    const newTimeout = setTimeout(() => {
      socketService.stopTyping(recipient?.userId);
    }, 3000);
    setTypingTimeout(newTimeout);
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
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground text-2xl">
            Select a chat to start messaging
          </p>
        </div>
      )}
    </div>
  );
}

const TypingIndicator = () => {
  return (
    <div className="w-16 h-6 ml-2 bg-neutral-700 rounded-full p-1 flex items-center justify-center">
      <div className="flex gap-1">
        <span className="h-2 w-2 rounded-full bg-white/80 animate-pulse" />
        <span className="h-2 w-2 rounded-full bg-white/80 animate-pulse delay-75" />
        <span className="h-2 w-2 rounded-full bg-white/80 animate-pulse delay-150" />
      </div>
    </div>
  );
};
