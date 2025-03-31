export type ViewType =
  | "main"
  | "search"
  | "new_message"
  | "new_group"
  | "new_channel"
  | "setting"
  | "theme_setting"
  | "contacts";

export interface User {
  _id: string;
  id: string;
  name: string;
  username: string;
  email: string;
  profilePicture: string;
  status: "offline" | "online";
}

export interface Participant {
  userId: {
    id: string;
    username: string;
    profilePicture: string;
    _id: string;
  };
  role: "member" | "admin";
  id: string;
  _id: string;
}

export interface Chat {
  _id: string;
  id: string;
  type: "private" | "group" | "channel";
  participants: Participant[];
  name: string;
  description: string;
  createdBy: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface Message {
  _id: string;
  id: string;
  conversationId: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  senderId: {
    _id: string;
    username: string;
    profilePicture?: string;
    id: string;
  };
  reactions: [];
  attachments: Attachment[];
  receiverId: string;
  isEdited: boolean;
  isDeleted: boolean;
  editedAt: Date;
  updatedAt: string;
  deletedAt: Date;
  createdAt: Date;
  timestamp: Date;
}

export interface Attachment {
  type: ["image", "video", "audio", "file"];
  url?: string;
  fileName: string;
  fileSize: string;
}

export type MessageType = "text" | "image" | "video" | "audio" | "file";

export type MessageStatus = "sent" | "delivered" | "read" | "failed";

export interface Contact {
  id: string;
  _id: string;
  username: string;
  profilePicture: string;
  email: string;
}
