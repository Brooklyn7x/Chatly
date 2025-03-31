import { Message } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MessageStore {
  messages: Record<string, Message[]>;
  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (chatId: string, message: Message) => void;
  deleteMessage: (chatId: string, messageId: string, message: Message) => void;
  updateMessageStatus: (messageId: string, update: Partial<Message>) => void;
}

export const useMessageStore = create<MessageStore>()(
  persist(
    (set) => ({
      messages: {},

      setMessages: (chatId, messages) =>
        set((state) => ({
          messages: { ...state.messages, [chatId]: messages },
        })),

      addMessage: (message: Message) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [message.conversationId]: [
              ...(state.messages[message.conversationId] || []),
              message,
            ],
          },
        })),

      updateMessage: (chatId, message) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: (state.messages[chatId] || []).map((msg) =>
              msg._id === message._id ? { ...msg, ...message } : msg
            ),
          },
        })),

      deleteMessage: (chatId, messageId) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: (state.messages[chatId] || []).filter(
              (message) => message._id !== messageId
            ),
          },
        }));
      },

      updateMessageStatus: (messageId, update) =>
        set((state) => ({
          messages: Object.fromEntries(
            Object.entries(state.messages).map(([chatId, messages]) => [
              chatId,
              messages.map((message) =>
                message._id === messageId ? { ...message, ...update } : message
              ),
            ])
          ),
        })),
    }),
    {
      name: "message-store",
    }
  )
);
