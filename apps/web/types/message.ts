export interface Message {
  _id: string;
  chatId: string;
  content: string;
  type: string;
  senderId:string
  receiverId: string;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
  sender?: {
    userId: string;
    timestamp: string;
  };
}

export interface MessageResponse {
  tempId?: string;
  messageId: string;
  status: string;
  timestamp: string;
}
