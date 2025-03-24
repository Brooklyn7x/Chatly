export interface Message {
  _id: string;
  chatId: string;
  conversationId: string;
  content: string;
  type: "text" | "image" | "video" | "audio" | "file";
  receiverId: string;
  timestamp: Date;
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
  timestamp: Date;
}

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
  FILE = "file",
}

export enum MessageStatus {
  SENT = "sending",
  DELIVERED = "delivered",
  READ = "read",
}

export interface MessageData {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type?: string;
  metadata?: Record<string, any>;
  replyTo?: string | null;
  attachments?: Array<{
    url: string;
    type: string;
    name?: string;
    size?: number;
    mimeType?: string;
  }>;
  tempId?: string;
}
