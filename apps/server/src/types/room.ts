import { Types } from "mongoose";

export interface Room {
  _id: Types.ObjectId;
  name: string;
  members: Types.ObjectId[];
  admins: Types.ObjectId[];
  isGroup: boolean;
  pinnedMessage?: Types.ObjectId;
  createdAt: Date;
}
