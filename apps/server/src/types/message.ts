export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  receiverId?: string;
  content: string;
  type: "text" | "image" | "video" | "audio" | "file";
  status: "sending" | "sent" | "delivered" | "read" | "failed";
  seenBy: Array<{
    userId: string;
    seenAt: Date;
  }>;
  deliveredTo: Array<{
    userId: string;
    deliveredAt: Date;
  }>;
  replyTo?: string;
  attachments?: Array<{
    url: string;
    type: "image" | "video" | "audio" | "file";
    name?: string;
    size?: number;
    mimeType?: string;
  }>;
  metadata?: Record<string, any>;
  edited: boolean;
  editedAt?: Date;
  deleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum MessageStatus {
  SENDING = "sending",
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
  FAILED = "failed",
}

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  FILE = "file",
}

export interface MessageMetaData {
  replyTo?: string;
  mentions?: string[];
  attachments?: Attachment;
  isEdited?: boolean;
  editedAt?: Date;
}

export interface Attachment {
  id: string;
  type: AttachmentType;
  url: string;
  size: number;
  name: string;
}

export enum AttachmentType {
  IMAGE = "image",
  DOCUMENT = "document",
  AUDIO = "audio",
  VIDEO = "video",
}

export interface CreateMessageDTO {
  conversationId: string;
  receiverId: string;
  content?: string;
  type: MessageType;
  metadata?: MessageMetaData;
}
