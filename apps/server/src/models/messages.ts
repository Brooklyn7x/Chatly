import { Schema, Types, model } from "mongoose";
export interface Message {
  _id: Types.ObjectId;
  roomId: Types.ObjectId;
  userId: Types.ObjectId;
  status: string;
  encryptedMessages: { userId: string; data: string }[];
  fileUrl?: string;
  timestamp: Date;
  delivered: Types.ObjectId[];
  read: Types.ObjectId[];
  edited: boolean;
  deleted: boolean;
  reactions: { userId: string; reaction: string }[];
}

const messageSchema = new Schema<Message>({
  roomId: {
    type: Schema.Types.ObjectId,
    ref: "Room",
    required: true,
    index: true,
  },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  fileUrl: { type: String },
  timestamp: { type: Date, default: Date.now, index: true },
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent",
  },
  delivered: [{ type: Schema.Types.ObjectId, ref: "User" }],
  read: [{ type: Schema.Types.ObjectId, ref: "User" }],
  edited: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
  reactions: [{ userId: String, reaction: String }],
});

export default model<Message>("Message", messageSchema);
