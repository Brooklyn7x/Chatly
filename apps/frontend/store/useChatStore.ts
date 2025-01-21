import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { User } from "@/types";
import axios from "axios";

export interface Participant {
  userId: string;
  role: "owner" | "admin" | "member";
  joinedAt: Date;
}
export interface ChatMetadata {
  title: string | null;
  description: string | null;
  avatar: string | null;
  isArchived: boolean;
  isPinned: boolean;
}

export interface Chat {
  _id: string;
  type: "direct" | "group";
  participants: Participant[];
  metadata: ChatMetadata;
  groupName: string | null;
  lastMessage: any;
  // unreadCount: { [key: string]: number };
  updatedAt: Date;
  createdAt: Date;
}

interface ChatStore {
  chats: Chat[];
  selectedChatId: string | null;
  isLoading: boolean;
  error: string | null;
  setSelectChat: (chatId: string) => void;
  fetchChats: () => void;
  getChat: (chatId: string) => Chat | undefined;
  createChat: (participants: User[], title?: string) => void;
  deleteChat: (chatId: string) => void;
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
          set({ isLoading: true, error: null });
          try {
            const response = await axios.get(
              "http://localhost:8000/conversations/user-conversations"
            );

            const chats = response.data.data.map((chat: any) => ({
              ...chat,
              createdAt: new Date(chat.createdAt),
              updatedAt: new Date(chat.updatedAt),
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
          return get().chats.find((chat) => chat._id === chatId);
        },

        createChat: async (participants, title) => {
          set({ isLoading: true });
          try {
            const payload = {
              type: participants.length > 1 ? "group" : "direct",
              participantIds: participants.map((user) => user._id),
              metadata: {
                title: participants.length > 1 ? title : null,
                description:
                  participants.length > 1
                    ? "Group conversation"
                    : "Direct conversation",
                avatar: null,
                isArchived: false,
                isPinned: false,
              },
            };

            const response = await axios.post(
              "http://localhost:8000/conversations/create",
              payload
            );

            const newChat = response.data.data;

            set((state) => ({
              chats: [
                ...state.chats,
                {
                  ...newChat,
                  createdAt: new Date(newChat.createdAt),
                  updatedAt: new Date(newChat.updatedAt),
                  unreadCount: {},
                },
              ],
              selectedChatId: response.data.id,
              isLoading: false,
            }));
          } catch (error: any) {
            console.error("Failed to create chat:", error);
            set({
              error: error?.response?.data?.error || "Failed to create chat",
              isLoading: false,
            });
          }
        },

        deleteChat: async (chatId) => {
          try {
            const response = await axios.delete(
              "http://localhost:8000/conversations/delete",
              {
                data: { conversationId: chatId },
              }
            );
            if (response.status === 200) {
              set((state) => ({
                chats: state.chats.filter((chat) => chat._id !== chatId),
              }));
            }
          } catch (error) {
            console.error("Failed to delete chat:", error);
          }
        },

        setSelectChat: (chatId) => {
          set({ selectedChatId: chatId });
        },
      }),
      {
        name: "chat-storage",
      }
    )
  )
);
