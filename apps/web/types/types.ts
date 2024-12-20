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
