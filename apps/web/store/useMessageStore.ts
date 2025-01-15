import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MessageSender {
  userId: string;
  timestamp: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  conversationType: "direct" | "group";
  content: string;
  type: "text" | "image" | "video" | "audio";
  status: "sent" | "delivered" | "read";
  senderId: string;
  receiverId: string;
  timestamp: string;
  sender?: MessageSender;
}

interface MessageStore {
  messages: Message[];
  loading: boolean;
  error: string | null;
  getMessages: (coversationId: string) => Message[];
  addMessage: (message: Message) => void;
  deleteMessage: (messageId: string) => void;
  updateMessageId: (tempId: string, messageId: string) => void;
  updateMessageStatus: (
    messageId: string,
    status: "sent" | "delivered" | "read"
  ) => void;
}

export const useMessageStore = create<MessageStore>()(
  persist(
    (set, get) => ({
      messages: [],
      loading: false,
      error: null,

      getMessages: (conversationId) => {
        return get()
          .messages.filter(
            (message) => message.conversationId === conversationId
          )
          .sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
      },

      addMessage: (message) => {
        set((state) => {
          const messageMap = new Map(
            state.messages.map((msg) => [msg._id, msg])
          );

          const formattedMessage = {
            _id: message._id,
            conversationId: message.conversationId,
            conversationType: message.conversationType,
            content: message.content,
            type: message.type || "text",
            status: message.status,
            senderId: message.senderId,
            receiverId: message.receiverId,
            timestamp: message.timestamp || new Date().toISOString(),
            sender: message.sender || {
              userId: message.senderId,
              timestamp: message.timestamp || new Date().toISOString(),
            },
          };

          messageMap.set(formattedMessage._id, formattedMessage);

          const sortedMessages = Array.from(messageMap.values()).sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

          return { messages: sortedMessages };
        });
      },

      updateMessageId(tempId, messageId) {
        set((state) => ({
          messages: state.messages.map((message) =>
            message._id === tempId ? { ...message, _id: messageId } : message
          ),
        }));
      },

      deleteMessage: (messageId) => {
        set((state) => ({
          messages: state.messages.filter(
            (message) => message._id !== messageId
          ),
        }));
      },

      updateMessageStatus: (
        messageId,
        status: "sent" | "delivered" | "read"
      ) => {
        set((state) => ({
          messages: state.messages.map((message) =>
            message._id === messageId ? { ...message, status } : message
          ),
        }));
      },

      // markMessagesAsRead: (conversationId) => {
      //   set((state) => ({
      //     messages: state.messages.map((message) =>
      //       message.conversationId === conversationId
      //         ? { ...message, status: "read" }
      //         : message
      //     ),
      //   }));
      // },
    }),
    {
      name: "message-store",
    }
  )
);
