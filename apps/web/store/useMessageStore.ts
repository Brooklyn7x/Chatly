import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MessageSender {
  userId: string;
  timestamp: string;
}

interface Message {
  _id: string;
  conversationId: string;
  conversationType: "private" | "group";
  content: string;
  type: "text" | "image" | "video" | "audio";
  senderId: string;
  receiverId: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  sender?: MessageSender;
}

interface MessageStore {
  messages: Message[];
  loading: boolean;
  error: string | null;
  getMessages: (coversationId: string) => Message[];
  addMessage: (message: Message) => void;
  deleteMessage: (messageId: string) => void;
}

export const useMessageStore = create<MessageStore>()(
  persist(
    (set, get) => ({
      messages: [],
      loading: false,
      error: null,

      getMessages: (chatId) => {
        return get()
          .messages.filter((message) => message.conversationId === chatId)
          .sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
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

          const newMessage: Message = {
            ...message,
            status: message.status || "sending",
            timestamp: message.timestamp || new Date().toISOString(),
          };

          const updatedMessages = [...state.messages, newMessage].sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

          return { messages: updatedMessages };
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
