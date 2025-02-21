export interface Message {
  _id: string;
  chatId: string;
  conversationId: string;
  content: string;
  type: "text" | "image" | "video" | "audio" | "file";
  receiverId: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  replyTo: any;
  edited: boolean;
  editedAt: Date;
  deleted: boolean;
  deletedAt: Date;
  seenBy: [];
  deliveredTo: [];
  attachments: [];
  senderId: {
    _id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MessageResponse {
  tempId?: string;
  messageId: string;
  status: string;
  timestamp: string;
}
