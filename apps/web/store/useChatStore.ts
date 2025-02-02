import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Chat, User } from "@/types";
import axios from "axios";

interface ChatStore {
  chats: Chat[];
  activeChatId: string | null;
  isLoading: boolean;
  error: string | null;

  setChats: (chats: Chat[]) => void;
  addChats: (chat: Chat) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  deleteChat: (chatId: string) => void;
  setActiveChat: (chatId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatStore>()(
  devtools(
    persist(
      (set) => ({
        chats: [],
        activeChatId: null,
        isLoading: false,
        error: null,

        setChats: (chats) => {
          set({ chats });
        },

        addChats: (chat) => {
          set((state) => ({
            chats: [...state.chats, chat],
          }));
        },

        updateChat: (chatId: string, updates: Partial<Chat>) => {
          set((state: ChatStore) => ({
            chats: state.chats.map((chat) =>
              chat._id === chatId ? { ...chat, ...updates } : chat
            ),
          }));
        },

        // createChat: async (participants, title) => {
        //   set({ isLoading: true });
        //   try {
        //     const payload = {
        //       type: participants.length > 1 ? "group" : "direct",
        //       participantIds: participants.map((user) => user._id),
        //       metadata: {
        //         title: participants.length > 1 ? title : null,
        //         description:
        //           participants.length > 1
        //             ? "Group conversation"
        //             : "Direct conversation",
        //         avatar: null,
        //         isArchived: false,
        //         isPinned: false,
        //       },
        //     };

        //     const response = await axios.post(
        //       "http://localhost:8000/conversations/create",
        //       payload
        //     );

        //     const newChat = response.data.data;

        //     set((state) => ({
        //       chats: [
        //         ...state.chats,
        //         {
        //           ...newChat,
        //           createdAt: new Date(newChat.createdAt),
        //           updatedAt: new Date(newChat.updatedAt),
        //           unreadCount: {},
        //         },
        //       ],
        //       selectedChatId: response.data.id,
        //       isLoading: false,
        //     }));
        //   } catch (error: any) {
        //     console.error("Failed to create chat:", error);
        //     set({
        //       error: error?.response?.data?.error || "Failed to create chat",
        //       isLoading: false,
        //     });
        //   }
        // },

        deleteChat: (chatId) => {
          set((state) => ({
            chats: state.chats.filter((chat) => chat._id !== chatId),
          }));
        },

        setActiveChat: (chatId) => {
          set({ activeChatId: chatId });
        },
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
      }),
      {
        name: "chat-storage",
      }
    )
  )
);
