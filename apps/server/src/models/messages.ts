import mongoose, { Schema } from "mongoose";

export interface IMessage extends Document {
  chatId: string;
  senderId: string;
  content: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  chatId: { type: String, required: true },
  senderId: { type: String },
  content: { text: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMessage>("Message", MessageSchema);
