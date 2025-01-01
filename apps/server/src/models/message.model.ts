import mongoose, { Schema } from "mongoose";
import { Message, MessageStatus, MessageType } from "../types/message";

export interface MessageDocument extends Message, Document {}

const MessageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
      sparse: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(MessageType),
      default: MessageStatus.SENDING,
    },
    status: {
      type: String,
      enum: Object.values(MessageStatus),
      default: MessageStatus.SENDING,
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    mentions: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    timestamp: {
      type: Date,
      default: Date.now,
    },

    readBy: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    deliveredTo: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
        deliveredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    attachments: [
      {
        url: {
          type: String,
          required: true,
        },
        name: String,
        type: {
          type: String,
          enum: ["image", "video", "audio", "document", "other"],
        },
        size: Number,
        metadata: Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
  }
);

MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1, createdAt: -1 });
MessageSchema.index({ mentions: 1 });
MessageSchema.index({ createdAt: -1 });

export const MessageModel = mongoose.model<MessageDocument>(
  "Message",
  MessageSchema
);
