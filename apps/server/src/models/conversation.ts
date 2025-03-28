import mongoose, { Schema, Document } from "mongoose";

export interface ConversationDocument extends Document {
  type: "private" | "group" | "channel";
  name?: string;
  descriptions?: string;
  image?: string;
  participants: Array<{
    userId: mongoose.Types.ObjectId;
    role: "admin" | "moderator" | "member";
    joinedAt: Date;
  }>;
  lastMessage?: {
    messageId: mongoose.Types.ObjectId;
    content: string;
    senderId: mongoose.Types.ObjectId;
    timestamp: Date;
  };
  createdBy: any;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<ConversationDocument>(
  {
    type: {
      type: String,
      enum: ["private", "group", "channel"],
      required: true,
    },
    name: {
      type: String,
      trim: true,
    },
    descriptions: {
      type: String,
      trim: true,
    },
    participants: [
      {
        userId: {
          type: mongoose.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["admin", "moderator", "member"],
          default: "member",
        },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    lastMessage: {
      type: mongoose.Types.ObjectId,
      ref: "Message",
    },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

conversationSchema.index({ participants: 1, updatedAt: -1 });

export default mongoose.model<ConversationDocument>(
  "Conversation",
  conversationSchema
);
