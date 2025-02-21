import mongoose, { Schema } from "mongoose";

export enum FileStatus {
  PROCESSING = "processing",
  READY = "ready",
  ERROR = "error",
}

const FileSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    context: {
      type: { 
        type: String, 
        enum: ['message', 'user', 'group', 'channel'],
        required: true 
      },
      id: { type: Schema.Types.ObjectId, required: true }
    },
    s3_key: { type: String, required: true, unique: true },
    mime_type: { type: String, required: true },
    size: { type: Number, required: true },
    versions: {
      original: String,
      thumbnail: String,
      preview: String
    },
    metadata: {
      width: Number,
      height: Number,
      duration: Number,
      pages: Number
    },
    status: {
      type: String,
      enum: Object.values(FileStatus),
      default: FileStatus.PROCESSING,
    },
  },
  {
    timestamps: true,
  }
);
FileSchema.index({ owner: 1, createdAt: -1 });
FileSchema.index({ 'context.id': 1 });

export const FileModel = mongoose.model("File", FileSchema);
