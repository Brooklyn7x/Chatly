import mongoose, { Schema } from "mongoose";

export enum FileStatus {
  PROCESSING = "processing",
  READY = "ready",
  ERROR = "error",
}

const FileSchema = new Schema(
  {
    fileId: {
      type: String,
      required: true,
      unique: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    s3Key: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["image", "video", "audio", "document", "other"],
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    messageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    url: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(FileStatus),
      default: FileStatus.PROCESSING,
    },
    metadata: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

FileSchema.index({ uploadedBy: 1, createdAt: -1 });
FileSchema.index({ conversationId: 1 });
FileSchema.index({ messageId: 1 });

export const FileModel = mongoose.model("File", FileSchema);
