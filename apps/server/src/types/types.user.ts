export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  messages: Message[];
  createdAt: Date;
}
