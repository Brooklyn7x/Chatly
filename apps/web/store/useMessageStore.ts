import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Message {
  id: string;
  chatId: string;
  content: string;
  type: "text" | "image" | "video" | "audio";
  senderId: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

interface MessageStore {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  getMessages: (chatId: string) => Message[];
  sendMessage: (
    chatId: string,
    content: string,
    type?: Message["type"]
  ) => void;
  deleteMessage: (messageId: string) => void;
  updateMessageStatus: (messageId: string, status: Message["status"]) => void;
  markMessagesAsRead: (chatId: string) => void;
}

export const useMessageStore = create<MessageStore>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      error: null,

      getMessages: (chatId) => {
        return get().messages.filter((message) => message.chatId === chatId);
      },

      sendMessage: async (chatId, content, type = "text") => {
        try {
          set({ isLoading: true, error: null });

          const newMessage: Message = {
            id: Date.now().toString(),
            chatId,
            content,
            type,
            senderId: "user-id",
            timestamp: new Date().toISOString(),
            status: "sent",
          };

          set((state) => ({
            messages: [...state.messages, newMessage],
            isLoading: false,
          }));
          
        } catch (error) {
          set({ error: "Failed to send message", isLoading: false });
        }
      },

      deleteMessage: (messageId) => {
        set((state) => ({
          messages: state.messages.filter(
            (message) => message.id !== messageId
          ),
        }));
      },

      updateMessageStatus: (messageId, status) => {
        set((state) => ({
          messages: state.messages.map((message) =>
            message.id === messageId ? { ...message, status } : message
          ),
        }));
      },

      markMessagesAsRead: (chatId) => {
        set((state) => ({
          messages: state.messages.map((message) =>
            message.chatId === chatId ? { ...message, status: "read" } : message
          ),
        }));
      },
    }),
    {
      name: "message-store",
    }
  )
);
