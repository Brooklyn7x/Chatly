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
  searchResults: User[];
  searchLoading: boolean;
  searchError: string | null;

  fetchChats: () => void;
  searchUsers: (query: string) => void;
  getChat: (chatId: string) => Chat | undefined;
  createChat: (participants: User[], title?: string) => void;
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
        searchError: null,
        searchResults: [],
        searchLoading: false,

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

        createChat: async (participants,title) => {
          set({ isLoading: true });
          try {
            const payload = {
              type: participants.length > 1 ? "group" : "direct",
              participantIds: participants.map((user) => user._id),
              metadata: {
                title: participants.length > 1 ? title : null,
                description: "One-on-one conversation",
              },
            };

            const response = await axios.post(
              "http://localhost:8000/conversations/create",
              payload
            );

            const newChat = {
              id: response.data.id,
              participants: participants,
              isGroup: participants.length > 1,
              groupName: title || null,
              lastMessage: null,
              unreadCount: 0,
            };

            set((state) => ({
              chats: [...state.chats, newChat],
              selectedChatId: response.data.id,
              isLoading: false,
            }));

            get().fetchChats();
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
                chats: state.chats.filter((chat) => chat.id !== chatId),
              }));
            }
          } catch (error) {
            console.error("Failed to delete chat:", error);
          }
        },

        searchUsers: async (query) => {
          set({ searchLoading: true, searchError: null });
          try {
            const response = await axios.get(
              `http://localhost:8000/users/search?query=${encodeURIComponent(query)}`
            );

            if (response.data.success) {
              set({
                searchResults: response.data.data.users,
                searchLoading: false,
              });
            } else {
              throw new Error(response.data.error);
            }
          } catch (error: any) {
            set({
              searchError:
                error?.response?.data?.error || "Failed to search users",
              searchLoading: false,
            });
          }
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
