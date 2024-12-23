export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  status: "offline";
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
  isGroup?: boolean;
  groupName?: string;
  lastMessage?: Message;
}
