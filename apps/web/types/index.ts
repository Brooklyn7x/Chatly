export interface User {
  _id: string;
  id: string;
  name: string;
  username: string;
  email: string;
  profilePicture: string;
  status: "offline" | "online";
  lastSeen: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

// export interface Chat {
//   id: string;
//   participants: User[];
//   messages: Message[];
//   unreadCount: number;
//   type: "direct" | "group";
//   groupName?: string;
//   lastMessage?: Message;
//   metadata: ConversationMetadata;
//   createdAt: string;
// }

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

export interface Participant {
  role: "owner" | "admin" | "member";
  joinedAt: Date;
  userId: {
    id: string;
    _id: string;
    username: string;
    email: string;
  };
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

interface MessageSender {
  userId: string;
  timestamp: string;
}

export interface Message {
  _id: string;
  chatId: string;
  conversationType: "direct" | "group";
  content: string;
  type: "text" | "image" | "video" | "audio";
  status: "sent" | "delivered" | "read";
  senderId: string;
  receiverId: string;
  timestamp: string;
  sender?: MessageSender;
}
