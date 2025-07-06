import { useCallback, useMemo, useEffect } from "react";
import { useChatStore } from "@/store/useChatStore";
import { useSocketStore } from "@/store/useSocketStore";
import { useSocket } from "@/providers/SocketProvider";
import { Chat, Message, MessageType } from "@/types";
import { toast } from "sonner";
import useAuthStore from "@/store/useAuthStore";
import { useAppStore } from "@/store/useAppStore";

interface SendMessageData {
  content: string;
  attachments?: File[];
  replyTo?: string;
  type?: "text" | "image" | "file" | "voice";
}

interface CreateChatData {
  type: "private" | "group";
  participants: string[];
  name?: string;
  description?: string;
  avatar?: string;
}

export const useChat = () => {
  // Get connection state from SocketProvider
  const { isConnected, isConnecting, error, reconnect } = useSocket();

  // Get emit function directly from socket store
  const { emit } = useSocketStore();

  const { user, isAuthenticated } = useAppStore();

  const {
    chats,
    activeChatId,
    messages,
    typingUsers,
    userStatuses,
    pinnedChats,
    setActiveChat,
    addMessage,
    addNewChat,
    updateMessage,
    deleteMessage,
    markAllMessagesAsRead,
    togglePinChat,
    getUnreadCount,
  } = useChatStore();

  // Auto-join active chat when connected
  useEffect(() => {
    if (isConnected && activeChatId) {
      console.log("🚪 useChat: Auto-joining active chat:", activeChatId);
      emit("chat_join", activeChatId);
    }
  }, [isConnected, activeChatId, emit]);

  // Derived state
  const activeChatMessages = activeChatId ? messages[activeChatId] || [] : [];
  const activeChat = useMemo(() => {
    return chats.find((c) => c._id === activeChatId || c.id === activeChatId);
  }, [chats, activeChatId]);

  const pinnedChatList = pinnedChats
    ? chats.filter((chat) => pinnedChats.has(chat._id ?? chat.id))
    : [];

  const unpinnedChats = pinnedChats
    ? chats.filter((chat) => !pinnedChats.has(chat._id ?? chat.id))
    : chats;

  const activeTypingUsers = !activeChatId
    ? []
    : typingUsers[activeChatId] || [];

  // ===== CHAT ACTIONS (EMIT TO SERVER) =====
  const joinChat = useCallback(
    (chatId: string) => {
      if (!isConnected || !chatId) {
        console.warn("⚠️ Cannot join chat: not connected or no chatId");
        return;
      }

      console.log("🚪 useChat: Joining chat", chatId);
      emit("chat_join", chatId);
      setActiveChat(chatId);
    },
    [isConnected, emit, setActiveChat]
  );

  const leaveChat = useCallback(
    (chatId: string) => {
      if (!isConnected || !chatId) return;

      console.log("🚪 useChat: Leaving chat", chatId);
      emit("chat_left", chatId);

      if (chatId === activeChatId) {
        setActiveChat(null);
      }
    },
    [isConnected, emit, activeChatId, setActiveChat]
  );

  const createChat = useCallback(
    (data: CreateChatData) => {
      if (!isConnected) {
        toast.error("Not connected to server");
        return;
      }

      console.log("🆕 useChat: Creating chat", data);
      emit("conversation:create", data);
    },
    [emit, isConnected]
  );

  // ===== MESSAGE ACTIONS (EMIT TO SERVER) =====
  const sendMessage = useCallback(
    (chatId: string, content: string, attachments: string[] = []) => {
      // Enhanced debugging
      console.log("🔍 DEBUG sendMessage requirements:", {
        isConnected,
        user,
        isAuthenticated,
        chatId,
        content: content?.trim(),
        contentLength: content?.trim()?.length,
      });

      if (!isConnected) {
        console.warn("⚠️ Cannot send message: not connected");
        toast.error("Not connected to server");
        return;
      }

      if (!user || !isAuthenticated) {
        console.warn("⚠️ Cannot send message: user not authenticated");
        toast.error("Please log in to send messages");
        return;
      }

      if (!chatId) {
        console.warn("⚠️ Cannot send message: no chat ID");
        toast.error("No chat selected");
        return;
      }

      if (!content || !content.trim()) {
        console.warn("⚠️ Cannot send message: empty content");
        return;
      }

      const tempId = `temp-${Date.now()}`;
      const tempMessage = {
        _id: tempId,
        id: tempId,
        conversationId: chatId,
        senderId: user.id, // Use user.id instead of user object
        content: content.trim(),
        type: attachments.length > 0 ? "image" : "text",
        status: "sent",
        attachments: attachments.map((url) => ({ url, type: "image" })),
        reactions: [],
        isEdited: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date().toISOString(),
      };

      console.log("📤 useChat: Sending message", tempMessage);

      // Add temporary message to UI immediately
      addMessage(tempMessage as any);

      // Emit to server
      emit("message_sent", {
        conversationId: chatId,
        content: content.trim(),
        type: attachments.length > 0 ? "image" : "text",
        tempId,
        attachment: attachments[0],
      });
    },
    [isConnected, user, isAuthenticated, addMessage, emit]
  );

  const editMessage = useCallback(
    (messageId: string, content: string) => {
      if (!isConnected || !messageId || !content.trim()) return;

      console.log("✏️ useChat: Editing message", messageId, content);
      emit("message_edit", { messageId, content });
    },
    [emit, isConnected]
  );

  const deleteMessageById = useCallback(
    (messageId: string) => {
      if (!isConnected || !messageId) return;

      console.log("🗑️ useChat: Deleting message", messageId);
      emit("message_delete", messageId);
    },
    [emit, isConnected]
  );

  // ===== TYPING ACTIONS (EMIT TO SERVER) =====
  const startTyping = useCallback(
    (chatId: string) => {
      if (!isConnected || !chatId) return;

      console.log("⌨️ useChat: Start typing", chatId);
      emit("typing_start", chatId);
    },
    [emit, isConnected]
  );

  const stopTyping = useCallback(
    (chatId: string) => {
      if (!isConnected || !chatId) return;

      console.log("⌨️ useChat: Stop typing", chatId);
      emit("typing_stop", chatId);
    },
    [emit, isConnected]
  );

  // ===== READ ACTIONS (EMIT TO SERVER) =====
  const markAsRead = useCallback(
    (chatId: string, messageId: string) => {
      if (!isConnected || !chatId || !messageId) return;

      console.log("👁️ useChat: Mark as read", chatId, messageId);
      emit("mark_as_read", { chatId, messageId });
    },
    [emit, isConnected]
  );

  const markAllRead = useCallback(
    (chatId: string) => {
      if (!isConnected || !chatId) return;

      console.log("👁️ useChat: Mark all as read", chatId);
      emit("mark_all_read", { chatId });
      markAllMessagesAsRead(chatId);
    },
    [emit, isConnected, markAllMessagesAsRead]
  );

  // ===== UTILITY FUNCTIONS =====
  const getChatName = useCallback(
    (chat: Chat) => {
      if (chat.type === "group") {
        return chat.name || "Group Chat";
      }
      const otherParticipant = chat.participants.find(
        (p) => p.userId._id !== user?.id
      );
      return otherParticipant?.userId.username || "Unknown User";
    },
    [user?.id]
  );

  const getChatAvatar = useCallback(
    (chat: Chat) => {
      if (chat.type === "group") {
        return chat.avatar || null;
      }
      const otherParticipant = chat.participants.find(
        (p) => p.userId._id !== user?.id
      );
      return otherParticipant?.userId.profilePicture || null;
    },
    [user?.id]
  );

  const isUserOnline = useCallback(
    (userId: string) => {
      const status = userStatuses[userId];
      return status?.status === "online";
    },
    [userStatuses]
  );

  const getLastMessage = useCallback(
    (chatId: string) => {
      const chatMessages = messages[chatId] || [];
      return chatMessages[chatMessages.length - 1] || null;
    },
    [messages]
  );

  const getFilteredChats = useCallback(
    (searchTerm: string) => {
      if (!searchTerm.trim()) return chats;
      const query = searchTerm.toLowerCase();
      return chats.filter((chat) => {
        if (chat.name?.toLowerCase().includes(query)) return true;
        return chat.participants.some((participant) =>
          participant.userId.username?.toLowerCase().includes(query)
        );
      });
    },
    [chats]
  );

  return {
    // Connection State
    isConnected,
    isConnecting,
    error,
    reconnect,

    // Chat State
    chats,
    activeChatId,
    activeChatMessages,
    pinnedChats: pinnedChatList,
    unpinnedChats,
    activeTypingUsers,
    activeChat,

    // Chat Actions
    joinChat,
    leaveChat,
    createChat,
    setActiveChat,

    // Message Actions
    sendMessage,
    editMessage,
    deleteMessage: deleteMessageById,
    markAsRead,
    markAllRead,

    // Typing Actions
    startTyping,
    stopTyping,

    // UI Actions
    togglePinChat,

    // Utility Functions
    getChatName,
    getChatAvatar,
    isUserOnline,
    getLastMessage,
    getUnreadCount,
    getFilteredChats,
  };
};

export default useChat;
