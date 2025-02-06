"use client";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/useChatStore";
import { useUIStore } from "@/store/useUiStore";
import { ChatInfo } from "./ChatInfo";
import ChatHeader from "./ChatHeader";
import MessageList from "../message/MessageList";
import MessageInput from "../message/MessageInput";

import useAuthStore from "@/store/useAuthStore";
import { TypingIndicator } from "../shared/TypingIndicator";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { useChatSocket } from "@/hooks/useChatSocket";
import { EmptyState } from "./EmptyChat";
import { useMessage } from "@/hooks/useMessage";
import { useMessageSocket } from "@/hooks/useMessageSocket";
import { useReadReceipts } from "@/hooks/useReadReceipt";
import { useUserStatus } from "@/hooks/useUserStatus";

export default function ChatWindow() {
  const [showChatInfo, setShowChatInfo] = useState(false);
  const { user } = useAuthStore();
  const userId = user?._id;
  const { isMobile } = useUIStore();
  const { activeChatId, chats } = useChatStore();
  const { messages } = useMessage(activeChatId || "");
  const { sendMessage } = useChatSocket(activeChatId || "");
  const { isTyping, handleTypingStart } = useTypingIndicator(
    activeChatId,
    userId
  );
  useMessageSocket();
  useReadReceipts(activeChatId, messages, user?._id);
  const currentChat = chats.find((chat) => chat._id === activeChatId);
  const otherUser = currentChat?.participants.find(
    (p) => p.userId.id !== userId
  );
  const { isOnline } = useUserStatus(otherUser?.userId.id);

  const handleMessage = useCallback(
    (content: string) => {
      if (!content.trim() || !activeChatId || !currentChat) return;
      sendMessage(content);
    },
    [activeChatId, currentChat, sendMessage]
  );

  const handleAttachmentUpload = async (files: any) => {
    // if (!activeChatId || !currentChat || !userId) return;
    // console.log(files, "file attachment");
    // try {
    //   for (const fileData of files) {
    //     const receiverId =
    //       currentChat.type === "direct"
    //         ? currentChat.participants.find((p) => p.userId !== userId)?.userId
    //         : undefined;
    //     await socketService.uploadFile({
    //       file: fileData.file,
    //       conversationId: activeChatId,
    //       receiverId,
    //       type: fileData.type,
    //     });
    //   }
    // } catch (error) {
    //   console.error("File upload failed:", error);
    // }
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
            chatId={activeChatId}
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
