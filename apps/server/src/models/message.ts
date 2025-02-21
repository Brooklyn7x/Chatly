import mongoose, { Schema } from "mongoose";
import { Message } from "../types/message";

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
      ref: "User",
      required: true,
      index: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "image", "video", "audio", "file"],
      default: "text",
    },
    status: {
      type: String,
      enum: ["sending", "sent", "delivered", "read", "failed"],
      default: "sending",
    },
    seenBy: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        seenAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    deliveredTo: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        deliveredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    attachments: [
      {
        url: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["image", "video", "audio", "file"],
          required: true,
        },
        name: String,
        size: Number,
        mimeType: String,
      },
    ],
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    edited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1, createdAt: -1 });
MessageSchema.index({ receiverId: 1, createdAt: -1 });
MessageSchema.index({ "seenBy.userId": 1 });
MessageSchema.index({ "deliveredTo.userId": 1 });

MessageSchema.methods.markAsSeen = async function (userId: string) {
  if (
    !this.seenBy.some(
      (entry: { userId: { toString: () => string } }) =>
        entry.userId.toString() === userId
    )
  ) {
    this.seenBy.push({
      userId: new mongoose.Types.ObjectId(userId),
      seenAt: new Date(),
    });

    if (this.status === "delivered") {
      this.status = "read";
    }

    await this.save();
  }
  return this;
};
MessageSchema.methods.markAsDelivered = async function (userId: string) {
  if (
    !this.deliveredTo.some(
      (entry: { userId: mongoose.Types.ObjectId }) =>
        entry.userId.toString() === userId
    )
  ) {
    this.deliveredTo.push({
      userId: new mongoose.Types.ObjectId(userId),
      deliveredAt: new Date(),
    });

    if (this.status === "sent") {
      this.status = "delivered";
    }

    await this.save();
  }
  return this;
};

MessageSchema.methods.softDelete = async function () {
  this.deleted = true;
  this.deletedAt = new Date();
  this.content = "This message was deleted";
  await this.save();
  return this;
};

export const MessageModel = mongoose.model<MessageDocument>(
  "Message",
  MessageSchema
);


