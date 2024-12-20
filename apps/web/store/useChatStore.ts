import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Chat, Message, User } from "@/types/types";

interface ChatStore {
  currentUser: User | null;
  chats: Chat[];
  selectedChatId: string | null;

  setCurrentUser: (user: User) => void;
  selectChat: (chatId: string) => void;
  sendMessage: (chatId: string, content: string) => void;
  updateMessageStatus: (
    chatId: string,
    messageId: string,
    status: Message["status"]
  ) => void;
}

export const useChatStore = create<ChatStore>()(
  devtools(
    persist(
      (set, get) => ({
        currentUser: null,
        chats: [],
        selectedChatId: null,
        sidebarOpen: false,

        setCurrentUser: (user) => set({ currentUser: user }),

        selectChat: (chatId) => {
          set({ selectedChatId: chatId });

          set((state) => ({
            chats: state.chats.map((chat) =>
              chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
            ),
          }));
        },

        sendMessage: (chatId, content) => {
          const newMessage = {
            id: Date.now().toString(),
            content,
            senderId: get().currentUser?.id || "",
            timestamp: new Date().toISOString(),
            status: "sent" as const,
          };

          set((state) => ({
            chats: state.chats.map((chat) =>
              chat.id === chatId
                ? {
                    ...chat,
                    messages: [...chat.messages, newMessage],
                    lastMessage: newMessage,
                  }
                : chat
            ),
          }));
        },

        updateMessageStatus: (chatId, messageId, status) => {
          set((state) => ({
            chats: state.chats.map((chat) =>
              chat.id === chatId
                ? {
                    ...chat,
                    message: chat.messages.map((message) =>
                      message.id === messageId
                        ? { ...message, status }
                        : message
                    ),
                  }
                : chat
            ),
          }));
        },
      }),
      {
        name: "chat-storage",
      }
    )
  )
);
