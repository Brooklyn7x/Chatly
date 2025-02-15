import { Message } from "./message";

export interface Conversation {
  type: ConversationType;
  participants: Participant[];
  lastMessage?: Message;
  unreadCount: Record<string, number>;
  metadata?: ConversationMetadata;
  updatedAt: Date;
  createdAt: Date;
}

export interface Participant {
  userId: string;
  role: ParticipantRole;
  joinedAt: Date;
  lastReadAt?: Date;
}

export enum ConversationType {
  DIRECT = "direct",
  GROUP = "group",
}

export enum ParticipantRole {
  OWNER = "owner",
  ADMIN = "admin",
  MEMBER = "member",
}

export interface ConversationMetadata {
  title?: string;
  description?: string;
  avatar?: string;
  isArchived?: boolean;
  isPinned?: boolean;
}

export interface CreateConversationDTO {
  type: ConversationType;
  participantIds: string[];
  metadata?: ConversationMetadata;
}

export interface CreateChatDTO {
  tempId: string;
  participantIds: string[];
  metadata?: {
    title?: string;
    description?: string;
    avatar?: string;
  };
}

export interface ChatResponse {
  tempId?: string;
  conversationId: string;
  type: ConversationType;
  participants: Participant[];
  metadata: any;
  createdAt: Date;
}
