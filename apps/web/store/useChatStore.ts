import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Chat, Message } from "@/types";

interface UserStatus {
  userId: string;
  status: "online" | "offline" | "away" | "busy";
  lastSeen: Date;
}

interface ChatStore {
  // Chat Management
  chats: Chat[];
  activeChatId: string | null;

  // Message Management
  messages: Record<string, Message[]>;

  // Real-time State
  typingUsers: Record<string, string[]>;
  userStatuses: Record<string, UserStatus>;

  // UI State
  pinnedChats: Set<string>;

  // Chat Actions
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  addNewChat: (chat: Chat) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  deleteChat: (chatId: string) => void;
  setActiveChat: (chatId: string | null) => void;

  // Message Actions
  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (
    chatId: string,
    messageId: string,
    updates: Partial<Message>
  ) => void;
  deleteMessage: (chatId: string, messageId: string) => void;
  markMessageAsRead: (chatId: string, messageId: string) => void;
  markAllMessagesAsRead: (chatId: string) => void;

  // Real-time Actions
  setTypingUsers: (chatId: string, userIds: string[]) => void;
  addTypingUser: (chatId: string, userId: string) => void;
  removeTypingUser: (chatId: string, userId: string) => void;
  clearTypingUsers: (chatId: string) => void;

  // User Status Actions
  updateUserStatus: (
    userId: string,
    status: Omit<UserStatus, "userId">
  ) => void;
  getUserStatus: (userId: string) => UserStatus | undefined;
  setUserOnline: (userId: string) => void;
  setUserOffline: (userId: string) => void;

  // UI Actions

  togglePinChat: (chatId: string) => void;
  setPinnedChats: (chatIds: string[]) => void;

  // Utility Actions
  clearChatData: () => void;
  getChatById: (chatId: string) => Chat | undefined;
  getMessagesByChatId: (chatId: string) => Message[];
  getUnreadCount: (chatId: string) => number;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // Initial State
      chats: [],
      activeChatId: null,
      messages: {},
      typingUsers: {},
      userStatuses: {},
      pinnedChats: new Set(),

      // Chat Actions
      setChats: (chats) => set({ chats }),

      addChat: (chat) =>
        set((state) => ({
          chats: [...state.chats, chat],
        })),

      addNewChat: (chat) =>
        set((state) => ({
          chats: [chat, ...state.chats],
        })),

      updateChat: (chatId, updates) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat._id === chatId ? { ...chat, ...updates } : chat
          ),
        })),

      deleteChat: (chatId) =>
        set((state) => {
          const newPinnedChats = new Set(state.pinnedChats);
          newPinnedChats.delete(chatId);

          // Remove messages for deleted chat
          const newMessages = { ...state.messages };
          delete newMessages[chatId];

          // Clear typing users for deleted chat
          const newTypingUsers = { ...state.typingUsers };
          delete newTypingUsers[chatId];

          return {
            chats: state.chats.filter((chat) => chat._id !== chatId),
            messages: newMessages,
            typingUsers: newTypingUsers,
            pinnedChats: newPinnedChats,
            activeChatId:
              state.activeChatId === chatId ? null : state.activeChatId,
          };
        }),

      setActiveChat: (chatId) => set({ activeChatId: chatId }),

      // Message Actions
      setMessages: (chatId, messages) =>
        set((state) => ({
          messages: { ...state.messages, [chatId]: messages },
        })),

      addMessage: (message) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [message.conversationId]: [
              ...(state.messages[message.conversationId] || []),
              message,
            ],
          },
        })),

      updateMessage: (chatId, messageId, updates) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: (state.messages[chatId] || []).map((msg) =>
              msg._id === messageId ? { ...msg, ...updates } : msg
            ),
          },
        })),

      deleteMessage: (chatId, messageId) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: (state.messages[chatId] || []).filter(
              (message) => message._id !== messageId
            ),
          },
        })),

      markMessageAsRead: (chatId, messageId) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: (state.messages[chatId] || []).map((msg) =>
              msg._id === messageId ? { ...msg, isRead: true } : msg
            ),
          },
        })),

      markAllMessagesAsRead: (chatId) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: (state.messages[chatId] || []).map((msg) => ({
              ...msg,
              isRead: true,
            })),
          },
        })),

      // Real-time Actions
      setTypingUsers: (chatId, userIds) =>
        set((state) => ({
          typingUsers: { ...state.typingUsers, [chatId]: userIds },
        })),

      addTypingUser: (chatId, userId) =>
        set((state) => {
          const currentUsers = state.typingUsers[chatId] || [];
          if (!currentUsers.includes(userId)) {
            return {
              typingUsers: {
                ...state.typingUsers,
                [chatId]: [...currentUsers, userId],
              },
            };
          }
          return state;
        }),

      removeTypingUser: (chatId, userId) =>
        set((state) => ({
          typingUsers: {
            ...state.typingUsers,
            [chatId]: (state.typingUsers[chatId] || []).filter(
              (id) => id !== userId
            ),
          },
        })),

      clearTypingUsers: (chatId) =>
        set((state) => ({
          typingUsers: { ...state.typingUsers, [chatId]: [] },
        })),

      // User Status Actions
      updateUserStatus: (userId, status) =>
        set((state) => ({
          userStatuses: {
            ...state.userStatuses,
            [userId]: { userId, ...status },
          },
        })),

      getUserStatus: (userId) => get().userStatuses[userId],

      setUserOnline: (userId) =>
        set((state) => ({
          userStatuses: {
            ...state.userStatuses,
            [userId]: {
              userId,
              status: "online",
              lastSeen: new Date(),
            },
          },
        })),

      setUserOffline: (userId) =>
        set((state) => ({
          userStatuses: {
            ...state.userStatuses,
            [userId]: {
              userId,
              status: "offline",
              lastSeen: new Date(),
            },
          },
        })),

      // UI Actions

      togglePinChat: (chatId) =>
        set((state) => {
          const newPinnedChats = new Set(state.pinnedChats);
          if (newPinnedChats.has(chatId)) {
            newPinnedChats.delete(chatId);
          } else {
            newPinnedChats.add(chatId);
          }
          return { pinnedChats: newPinnedChats };
        }),

      setPinnedChats: (chatIds) => set({ pinnedChats: new Set(chatIds) }),

      // Utility Actions
      clearChatData: () =>
        set({
          chats: [],
          activeChatId: null,
          messages: {},
          typingUsers: {},
          pinnedChats: new Set(),
        }),

      getChatById: (chatId) => get().chats.find((chat) => chat._id === chatId),

      getMessagesByChatId: (chatId) => get().messages[chatId] || [],

      getUnreadCount: (chatId) => {
        const messages = get().messages[chatId] || [];
        return messages.filter((msg) => !msg.isRead).length;
      },
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        chats: state.chats,
        activeChatId: state.activeChatId,
        messages: state.messages,
        pinnedChats: Array.from(state.pinnedChats), // Convert Set to Array for persistence
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        // Convert pinnedChats array → Set
        if (Array.isArray(state.pinnedChats)) {
          state.pinnedChats = new Set(state.pinnedChats);
        }

        // Migrate legacy `activeChat` to `activeChatId`
        // Some old sessions stored `activeChat` instead of `activeChatId`
        // If we detect it, move the value and delete the old key.
        if ((state as any).activeChat && !state.activeChatId) {
          state.activeChatId = (state as any).activeChat;
          delete (state as any).activeChat;
        }
      },
    }
  )
);

export default useChatStore;
