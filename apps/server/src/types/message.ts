export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  timestamp: Date;
  metadata?: MessageMetaData;
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

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
  SYSTEM = "system",
}

export enum MessageStatus {
  SENDING = "sending",
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
  FAILED = "failed",
}

export interface CreateMessageDTO {
  conversationId: string;
  receiverId: string;
  content: string;
  type: MessageType;
  metadata?: MessageMetaData;
}
