import { useCallback, useEffect, useState } from "react";
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
import useUserStatusStore from "@/store/useStatusStore";

export default function ChatWindow() {
  const { user } = useAuth();
  const { isMobile } = useUIStore();
  const { selectedChatId, chats } = useChatStore();
  const { getMessages, addMessage } = useMessageStore();
  const token = useAuthStore((state) => state.accessToken) || ``;
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // const [userStatuses, setUserStatuses] = useState<Record<string, string>>({});
  const currentChat = chats.find((chat) => chat._id === selectedChatId);
  const messages = selectedChatId ? getMessages(selectedChatId) : [];
  const userId = user?._id;
  const userStatuses = useUserStatusStore((state) => state.userStatus);
  useSocketChat(token, selectedChatId, user);

  useEffect(() => {
    if (!selectedChatId || !currentChat || !messages.length || !userId) {
      return;
    }
    const unreadMessages = messages.filter(
      (message) => message.senderId !== userId && message.status !== "read"
    );

    if (unreadMessages.length > 0) {
      socketService.markMessagesAsRead({
        messageIds: unreadMessages.map((msg) => msg._id),
        conversationId: selectedChatId,
      });
    }
  }, []);

  useEffect(() => {
    const unsubscribeMessageStatus = socketService.onMessageStatus((status) => {
      if (status.conversationId === selectedChatId) {
        useMessageStore
          .getState()
          .updateMessageStatus(status.messageId, status.status);
      }
    });

    return () => {
      unsubscribeMessageStatus();
    };
  }, [selectedChatId]);

  // useEffect(() => {
  //   const handleStatusChange = (data: { userId: string; status: string }) => {
  //     useUserStatusStore.getState().setUserStatus(data.userId, data.status);
  //   };

  //   const unsubscribeUserStatus =
  //     socketService.onUserStatusChange(handleStatusChange);

  //   return () => {
  //     unsubscribeUserStatus();
  //   };
  // }, []);

  const otherUser = currentChat?.participants.find((p) => p.userId !== userId);
  const isOnline = otherUser
    ? userStatuses[otherUser.userId] === "online"
    : false;

  console.log(isOnline);

  const { isTyping, handleTypingStart } = useTypingIndicator(
    currentChat,
    userId
  );

  const handleMessage = useCallback(
    (content: string) => {
      if (!content.trim() || !selectedChatId || !currentChat) return;
      const tempId = `temp-${Date.now()}`;
      const messageData = {
        _id: tempId,
        senderId: userId,
        conversationId: selectedChatId,
        content,
        type: "text",
        status: "sent",
        timestamp: new Date().toISOString(),
        conversationType: currentChat?.type as "direct" | "group",
        ...(currentChat?.type === "direct" && {
          receiverId: currentChat.participants.find((p) => p.userId !== userId)
            ?.userId,
        }),
      };

      addMessage(messageData);
      socketService.sendMessage(messageData);

      // const unsubscribe = socketService.onMessageSent((response) => {
      //   console.log(response);

      //   // if (response.tempId === tempId) {
      //   //     useMessageStore.getState().updateMessageId(tempId, response.messageId);
      //   //     unsubscribe();
      //   // }
      // });
    },
    [selectedChatId, currentChat, userId]
  );

  const handleAttachmentUpload = async (files: any) => {
    if (!selectedChatId || !currentChat || !userId) return;
    console.log(files, "file attachment");
    try {
      for (const fileData of files) {
        const receiverId =
          currentChat.type === "direct"
            ? currentChat.participants.find((p) => p.userId !== userId)?.userId
            : undefined;

        await socketService.uploadFile({
          file: fileData.file,
          conversationId: selectedChatId,
          receiverId,
          type: fileData.type,
        });
      }
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

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
          <ChatHeader
            onProfileClick={toggleProfile}
            chat={currentChat}
            isOnline={isOnline}
          />

          <MessageList messages={messages} currentUserId={userId} />

          {isTyping && <TypingIndicator />}

          <MessageInput
            onSendMessage={handleMessage}
            onTypingStart={handleTypingStart}
            onFileUpload={handleAttachmentUpload}
          />

          {isProfileOpen && (
            <UserProfilePanel
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
              chat={currentChat}
            />
          )}
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
