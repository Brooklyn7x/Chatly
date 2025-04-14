import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Chat } from "@/types";

interface ChatStore {
  chats: Chat[];
  activeChatId: string | null;
  setChats: (chats: Chat[]) => void;
  addChats: (chat: Chat) => void;
  addNewChat: (chat: Chat) => void;
  setActiveChat: (chatId: string | null) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  deleteChat: (chatId: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      chats: [],
      activeChatId: null,

      setChats: (chats) => {
        set({ chats });
      },

      addNewChat: (chat) => {
        set((state) => ({
          chats: [chat, ...state.chats],
        }));
      },

      addChats: (chat) => {
        set((state) => ({
          chats: [...state.chats, chat],
        }));
      },

      setActiveChat: (chatId) => {
        set({ activeChatId: chatId });
      },

      updateChat: (chatId, updates) => {
        set((state: ChatStore) => ({
          chats: state.chats.map((chat) =>
            chat._id === chatId ? { ...chat, ...updates } : chat
          ),
        }));
      },

      deleteChat: (chatId) => {
        set((state) => ({
          chats: state.chats.filter((chat) => chat._id !== chatId),
        }));
      },
    }),
    {
      name: "chat-storage",
    }
  )
);
