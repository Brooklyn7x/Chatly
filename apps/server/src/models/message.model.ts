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
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(MessageType),
    },
    status: {
      type: String,
      enum: Object.values(MessageStatus),
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "message",
    },
    mentions: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    attachments: [
      {
        type: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        name: String,
        size: Number,
        metadata: Schema.Types.Mixed,
      },
    ],
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
    isEdited: {
      type: Boolean,
      default: false,
    },
    editHistory: [
      {
        content: String,
        editedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
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
