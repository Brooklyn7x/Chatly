export enum ParticipantRole {
  OWNER = "owner",
  ADMIN = "admin",
  MEMBER = "member",
}

export type ChatUpdatePayload = {
  metadata?: {
    title?: string;
    description?: string;
    avatar?: string;
    isArchived?: boolean;
    isPinned?: boolean;
  };
  participants?: Array<{
    action: "add" | "remove" | "updateRole";
    userId: string;
    role?: ParticipantRole;
  }>;
};
