import mongoose, { Schema } from "mongoose";

export interface MessageDocument extends Document {
  conversationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  type: "text" | "image" | "video" | "file" | "system";
  content: string;
  status: string;
  attachments?: Array<{
    type: string;
    url: string;
    fileName?: string;
    fileSize?: number;
  }>;
  reactions?: Array<{
    emoji: string;
    userId: mongoose.Types.ObjectId;
    timestamp: Date;
  }>;
  isEdited: boolean;
  editedAt?: Date;
  isDeleted: boolean;
  deletedAt: Date;
  timestamp: Date;
}

const messageSchema = new Schema<MessageDocument>(
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
    type: {
      type: String,
      enum: ["text", "image", "video", "audio", "file"],
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read", "failed"],
      default: "sent",
    },
    attachments: [
      {
        type: {
          type: String,
          enum: ["image", "video", "audio", "file"],
          required: true,
        },
        url: {
          type: String,
        },
        fileName: { type: String },
        fileSize: { type: Number },
      },
    ],
    reactions: [
      {
        emoji: { type: String },
        userId: { type: mongoose.Types.ObjectId, ref: "User" },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1, createdAt: -1 });

export default mongoose.model<MessageDocument>("Message", messageSchema);
