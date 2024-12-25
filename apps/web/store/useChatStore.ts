import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { User } from "@/types";
import axios from "axios";

interface Chat {
  id: string;
  participants: User[];
  isGroup: boolean;
  groupName: string | null;
  lastMessage: any;
  unreadCount: number;
}

interface ChatStore {
  chats: Chat[];
  selectedChatId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchChats: () => void;
  getChat: (chatId: string) => Chat | undefined;
  createChat: (participants: User[]) => void;
  deleteChat: (chatId: string) => void;
  setSelectChat: (chatId: string) => void;

}

export const useChatStore = create<ChatStore>()(
  devtools(
    persist(
      (set, get) => ({
        chats: [],
        selectedChatId: null,
        isLoading: false,
        error: null,

        fetchChats: async () => {
          set({ isLoading: true });
          try {
            const response = await axios.get(
              "http://localhost:8000/conversations/user-conversations"
            );
            const { data } = response.data;

            const chats = data.map((chat: any) => ({
              ...chat,
              unreadCount:
                typeof chat.unreadCount === "number" ? chat.unreadCount : 0,
            }));
            set({ chats: chats, isLoading: false });
          } catch (error: any) {
            set({
              error: error?.response?.data?.error || "Failed to fetch chats",
              isLoading: false,
            });
          } finally {
            set({ isLoading: false });
          }
        },

        getChat: (chatId) => {
          return get().chats.find((chat) => chat.id === chatId);
        },

        createChat: (participants) => {
          set((state) => ({
            chats: [
              ...state.chats,
              {
                id: Math.random().toString(36).substring(2, 9),
                participants,
                isGroup: participants.length > 1,
                groupName: participants.length > 1 ? "Group" : null,
                lastMessage: null,
                unreadCount: 0,
              },
            ],
          }));
        },

        deleteChat: (chatId) => {
          set((state) => ({
            chats: state.chats.filter((chat) => chat.id !== chatId),
          }));
        },

        setSelectChat: (chatId) => {
          set({ selectedChatId: chatId });

          set((state) => ({
            chats: state.chats.map((chat) =>
              chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
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
