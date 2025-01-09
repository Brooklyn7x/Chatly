export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  status: "offline" | "online";
  lastSeen?: string;
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
  type: "direct" | "group";
  groupName?: string;
  lastMessage?: Message;
  metadata: ConversationMetadata;
  createdAt: string;
}

interface ConversationMetadata {
  avatar?: string;
  title?: string;
  description?: string;
  isArchived?: boolean;
  isPinned?: boolean;
}

export interface Conversation {
  id: string;
  participants: User[];
  isGroup: boolean;
  groupName: string | null;
  lastMessage: any;
  unreadCount: number;
}
