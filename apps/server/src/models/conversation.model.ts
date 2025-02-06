import mongoose, { Schema, Document } from "mongoose";
import {
  Conversation,
  ConversationType,
  ParticipantRole,
} from "../types/conversation";

export interface IConversationDocument extends Conversation, Document {}

const ParticipantSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(ParticipantRole),
      default: ParticipantRole.MEMBER,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    lastReadAt: {
      type: Date,
    },
  },
  { _id: false }
);

const ConversationSchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(ConversationType),
      required: true,
    },
    participants: [ParticipantSchema],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    metadata: {
      title: String,
      description: String,
      avatar: String,
      isArchived: {
        type: Boolean,
        default: false,
      },
      isPinned: {
        type: Boolean,
        default: false,
      },
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: () => new Map(),
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ConversationSchema.virtual("recentMessages", {
  ref: "Message",
  localField: "_id",
  foreignField: "conversationId",
  options: {
    sort: { createdAt: -1 },
    limit: 20,
  },
});

ConversationSchema.virtual("participantsDetails", {
  ref: "user",
  localField: "participants.userId",
  foreignField: "_id",
  justOne: false,
  options: {
    select: "-password -__v -createdAt -updatedAt",
  },
});

ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ "participants.userId": 1 });
ConversationSchema.index({ updatedAt: -1 });
ConversationSchema.index({
  "metadata.isArchived": 1,
  updatedAt: -1,
});

export const ConversationModel = mongoose.model<IConversationDocument>(
  "Conversation",
  ConversationSchema
);
