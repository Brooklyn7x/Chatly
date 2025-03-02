import { Message } from "@/types/message";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MessageStore {
  messages: Record<string, Message[]>;
  isLoading: boolean;
  error: string | null;

  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (
    chatId: string,
    tempId: string,
    updates: Partial<Message>
  ) => void;
  deleteMessage: (chatId: string, messageId: string) => void;
  updateMessageStatus: (messageId: string, updates: Partial<Message>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMessageStore = create<MessageStore>()(
  persist(
    (set) => ({
      messages: {},
      isLoading: false,
      error: null,

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

      updateMessage: (chatId, tempId, updates) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: (state.messages[chatId] || []).map((message) =>
              message._id === tempId ? { ...message, ...updates } : message
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

      updateMessageStatus: (messageId, updates) =>
        set((state) => ({
          messages: {
            ...state.messages,
            ...Object.fromEntries(
              Object.entries(state.messages).map(([chatId, messages]) => [
                chatId,
                messages.map((message) =>
                  message._id === messageId
                    ? { ...message, ...updates }
                    : message
                ),
              ])
            ),
          },
        })),

      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "message-store",
    }
  )
);
