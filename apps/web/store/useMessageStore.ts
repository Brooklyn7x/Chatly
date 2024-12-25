import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Message {
  _id: string;
  conversationId: string;
  content: string;
  type: "text" | "image" | "video" | "audio";
  senderId: string;
  receiverId: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

interface MessageStore {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  getMessages: (chatId: string) => Message[];
  deleteMessage: (messageId: string) => void;
  updateMessageStatus: (messageId: string, status: Message["status"]) => void;
  markMessagesAsRead: (chatId: string) => void;
  addMessage: (message: Message) => void;
}

export const useMessageStore = create<MessageStore>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      error: null,

      getMessages: (chatId) => {
        return get().messages.filter(
          (message) => message.conversationId === chatId
        );
      },

      addMessage: (message) => {
        set((state) => {
          const messageExists = state.messages.some(
            (m) => m._id === message._id
          );

          if (messageExists) {
            return state;
          }

          const conversationMessages = state.messages.filter(
            (m) => m.conversationId === message.conversationId
          );

          const updatedConversationMessages = [
            ...conversationMessages,
            message,
          ].sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

          const otherMessages = state.messages.filter(
            (m) => m.conversationId !== message.conversationId
          );

          return {
            messages: [...otherMessages, ...updatedConversationMessages],
          };
        });
      },

      deleteMessage: (messageId) => {
        set((state) => ({
          messages: state.messages.filter(
            (message) => message._id !== messageId
          ),
        }));
      },

      updateMessageStatus: (messageId, status) => {
        set((state) => ({
          messages: state.messages.map((message) =>
            message._id === messageId ? { ...message, status } : message
          ),
        }));
      },

      markMessagesAsRead: (chatId) => {
        set((state) => ({
          messages: state.messages.map((message) =>
            message.conversationId === chatId
              ? { ...message, status: "read" }
              : message
          ),
        }));
      },
    }),
    {
      name: "message-store",
    }
  )
);
