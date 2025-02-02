"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/useChatStore";
import { useUIStore } from "@/store/useUiStore";
import { ChatInfo } from "./ChatInfo";
import ChatHeader from "./ChatHeader";
import MessageList from "../message/MessageList";
import MessageInput from "../message/MessageInput";
import socketService from "@/services/socket/socket";
import useAuthStore from "@/store/useAuthStore";
import { TypingIndicator } from "../shared/TypingIndicator";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { useSocketChat } from "@/hooks/useSocketChat";
import { EmptyState } from "./EmptyChat";
import useUserStatusStore from "@/store/useStatusStore";
import { useMessage } from "@/hooks/useMessage";
import { useSocket } from "@/hooks/useSocket";
import { useReadReceipts } from "@/hooks/useReadReceipt";

export default function ChatWindow() {
  const { user } = useAuthStore();
  const { isMobile } = useUIStore();
  const { activeChatId, chats } = useChatStore();
  const { messages } = useMessage(activeChatId || "");

  const [showChatInfo, setShowChatInfo] = useState(false);
  // const [userStatuses, setUserStatuses] = useState<Record<string, string>>({});
  // const messages = activeChatId ? getMessages(activeChatId) : [];
  const userId = user?._id;
  const currentChat = chats.find((chat) => chat._id === activeChatId);
  const userStatuses = useUserStatusStore((state) => state.userStatus);
  const { sendMessage } = useSocketChat(activeChatId || "");
  useSocket();
  useReadReceipts(activeChatId, messages, user?._id);

  //   }
  //   const unreadMessages = messages.filter(
  //     (message) => message.senderId !== userId && message.status !== "read"
  //   );

  //   if (unreadMessages.length > 0) {
  //     socketService.markMessagesAsRead({
  //       messageIds: unreadMessages.map((msg) => msg._id),
  //       conversationId: activeChatId,
  //     });
  //   }
  // }, []);

  // useEffect(() => {
  //   const unsubscribeMessageStatus = socketService.onMessageStatus((status) => {
  //     if (status.conversationId === activeChatId) {
  //       useMessageStore
  //         .getState()
  //         .updateMessageStatus(status.messageId, status.status);
  //     }
  //   });

  //   return () => {
  //     unsubscribeMessageStatus();
  //   };
  // }, [activeChatId]);

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

  const { isTyping, handleTypingStart } = useTypingIndicator(
    activeChatId,
    userId
  );

  console.log(isTyping, "tpying");

  const handleMessage = useCallback(
    (content: string) => {
      if (!content.trim() || !activeChatId || !currentChat) return;
      sendMessage(content);
    },
    [activeChatId, currentChat, sendMessage]
  );

  const handleAttachmentUpload = async (files: any) => {
    if (!activeChatId || !currentChat || !userId) return;
    console.log(files, "file attachment");
    try {
      for (const fileData of files) {
        const receiverId =
          currentChat.type === "direct"
            ? currentChat.participants.find((p) => p.userId !== userId)?.userId
            : undefined;

        await socketService.uploadFile({
          file: fileData.file,
          conversationId: activeChatId,
          receiverId,
          type: fileData.type,
        });
      }
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  const toggleProfile = useCallback(() => {
    setShowChatInfo((prev) => !prev);
  }, []);

  return (
    <div
      className={cn(
        "flex-1 flex flex-col",
        "bg-neutral-800/20",
        "transition-[transform,width] duration-300 ease-in-out",
        {
          "translate-x-full": isMobile && !activeChatId,
          "translate-x-0": !isMobile || activeChatId,
          "absolute inset-y-0 right-0 w-full z-10": isMobile,
          relative: !isMobile,
        }
      )}
    >
      {currentChat ? (
        <>
          <ChatHeader
            onInfoClick={toggleProfile}
            chat={currentChat}
            isOnline={isOnline}
          />

          <MessageList messages={messages} />

          {isTyping && <TypingIndicator />}

          <MessageInput
            onSendMessage={handleMessage}
            onTypingStart={handleTypingStart}
            onFileUpload={handleAttachmentUpload}
          />

          {showChatInfo && (
            <ChatInfo
              isOpen={showChatInfo}
              onClose={() => setShowChatInfo(false)}
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
