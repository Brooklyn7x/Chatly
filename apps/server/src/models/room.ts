import mongoose, { model, Schema, Types } from "mongoose";

export interface Room {
  _id: Types.ObjectId;
  name: string;
  members: Types.ObjectId[];
  admins: Types.ObjectId[];
  isGroup: boolean;
  pinnedMessage?: Types.ObjectId;
  createdAt: Date;
}

const roomSchema = new Schema<Room>({
  name: { type: String, required: true, trim: true },
  members: [{ type: Schema.Types.ObjectId, ref: "User", index: true }],
  admins: [{ type: Schema.Types.ObjectId, ref: "User" }],
  isGroup: { type: Boolean, default: false },
  pinnedMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  createdAt: { type: Date, default: Date.now },
});

export default model<Room>("Room", roomSchema);
