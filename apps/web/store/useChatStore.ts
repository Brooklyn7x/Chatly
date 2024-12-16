import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "offline" | "away";
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

export interface Chat {
  id: string;
  participants: User[];
  messages: Message[];
  unreadCount: number;
  isGroup?: boolean;
  groupName?: string;
  lastMessage?: Message;
}

interface ChatStore {
  currentUser: User | null;
  chats: Chat[];
  selectedChatId: string | null;
  sidebarOpen: boolean;

  setCurrentUser: (user: User) => void;
  selectChat: (chatId: string) => void;
  sendMessage: (chatId: string, content: string) => void;
  updateMessageStatus: (
    chatId: string,
    messageId: string,
    status: Message["status"]
  ) => void;
  toggleSidebar: () => void;
}

const dummyUsers: User[] = [
  { id: "1", name: "Alice", avatar: "/avatars/alice.png", status: "online" },
  { id: "2", name: "Bob", avatar: "/avatars/bob.png", status: "offline" },
  { id: "3", name: "Charlie", avatar: "/avatars/charlie.png", status: "away" },
  { id: "4", name: "David", avatar: "/avatars/david.png", status: "online" },
  { id: "5", name: "Eve", avatar: "/avatars/eve.png", status: "offline" },
  { id: "6", name: "Frank", avatar: "/avatars/frank.png", status: "away" },
  { id: "7", name: "Grace", avatar: "/avatars/grace.png", status: "online" },
];
const dummyMessages: Message[] = [
  {
    id: "101",
    content: "Hey, how are you?",
    senderId: "1",
    timestamp: new Date().toISOString(),
    status: "read",
  },
  {
    id: "102",
    content: "I'm good, thanks! You?",
    senderId: "2",
    timestamp: new Date().toISOString(),
    status: "delivered",
  },
  {
    id: "103",
    content: "What time are we meeting today?",
    senderId: "1",
    timestamp: new Date().toISOString(),
    status: "sent",
  },
  {
    id: "104",
    content: "I'll be there by 5 PM.",
    senderId: "3",
    timestamp: new Date().toISOString(),
    status: "read",
  },
  {
    id: "105",
    content: "See you then!",
    senderId: "1",
    timestamp: new Date().toISOString(),
    status: "delivered",
  },
  {
    id: "106",
    content: "Let's catch up this weekend.",
    senderId: "4",
    timestamp: new Date().toISOString(),
    status: "sent",
  },
  {
    id: "107",
    content: "Sure thing! What day works for you?",
    senderId: "5",
    timestamp: new Date().toISOString(),
    status: "delivered",
  },
];
const dummyChats: Chat[] = [
  {
    id: "chat1",
    participants: [dummyUsers[0], dummyUsers[1]],
    messages: [dummyMessages[0], dummyMessages[1]],
    unreadCount: 1,
    isGroup: false,
    lastMessage: dummyMessages[1],
  },
  {
    id: "chat2",
    participants: [dummyUsers[0], dummyUsers[2]],
    messages: [dummyMessages[2], dummyMessages[3], dummyMessages[4]],
    unreadCount: 0,
    isGroup: false,
    lastMessage: dummyMessages[4],
  },
  {
    id: "chat3",
    participants: [dummyUsers[0], dummyUsers[3], dummyUsers[4]],
    messages: [dummyMessages[5], dummyMessages[6]],
    unreadCount: 2,
    isGroup: true,
    groupName: "Weekend Plans",
    lastMessage: dummyMessages[6],
  },
  {
    id: "chat4",
    participants: [dummyUsers[1], dummyUsers[5]],
    messages: [
      {
        id: "108",
        content: "Did you finish the project?",
        senderId: "2",
        timestamp: new Date().toISOString(),
        status: "sent",
      },
      {
        id: "109",
        content: "Yes, just sent it over!",
        senderId: "6",
        timestamp: new Date().toISOString(),
        status: "read",
      },
    ],
    unreadCount: 0,
    isGroup: false,
    lastMessage: {
      id: "109",
      content: "Yes, just sent it over!",
      senderId: "6",
      timestamp: new Date().toISOString(),
      status: "read",
    },
  },
  {
    id: "chat5",
    participants: [dummyUsers[3], dummyUsers[4], dummyUsers[6]],
    messages: [
      {
        id: "110",
        content: "Happy Birthday, Grace!",
        senderId: "4",
        timestamp: new Date().toISOString(),
        status: "sent",
      },
      {
        id: "111",
        content: "Thank you so much!",
        senderId: "7",
        timestamp: new Date().toISOString(),
        status: "delivered",
      },
    ],
    unreadCount: 1,
    isGroup: true,
    groupName: "Friends Chat",
    lastMessage: {
      id: "111",
      content: "Thank you so much!",
      senderId: "7",
      timestamp: new Date().toISOString(),
      status: "delivered",
    },
  },
];

export const useChatStore = create<ChatStore>()(
  devtools(
    persist(
      (set, get) => ({
        currentUser: dummyUsers[0],
        chats: dummyChats,
        selectedChatId: null,
        sidebarOpen: false,

        setCurrentUser: (user) => set({ currentUser: user }),

        selectChat: (chatId) => {
          set({ selectedChatId: chatId });

          set((state) => ({
            chats: state.chats.map((chat) =>
              chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
            ),
          }));
        },

        sendMessage: (chatId, content) => {
          const newMessage = {
            id: Date.now().toString(),
            content,
            senderId: get().currentUser?.id || "",
            timestamp: new Date().toISOString(),
            status: "sent" as const,
          };

          set((state) => ({
            chats: state.chats.map((chat) =>
              chat.id === chatId
                ? {
                    ...chat,
                    messages: [...chat.messages, newMessage],
                    lastMessage: newMessage,
                  }
                : chat
            ),
          }));
        },

        updateMessageStatus: (chatId, messageId, status) => {
          set((state) => ({
            chats: state.chats.map((chat) =>
              chat.id === chatId
                ? {
                    ...chat,
                    message: chat.messages.map((message) =>
                      message.id === messageId
                        ? { ...message, status }
                        : message
                    ),
                  }
                : chat
            ),
          }));
        },

        toggleSidebar: () =>
          set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      }),
      {
        name: "chat-storage",
      }
    )
  )
);
