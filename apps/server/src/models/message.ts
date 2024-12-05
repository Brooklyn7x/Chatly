import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  senderId: string;
  receiverId: string;
  content: string;
}

const messageSchema = new Schema<Message>(
  {
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const MessageModel = mongoose.model<Message>("Message", messageSchema);
