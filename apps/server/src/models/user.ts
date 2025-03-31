import mongoose, { Schema, Document } from "mongoose";
import { UserStatus } from "../types/user";

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  status: UserStatus;
  isOnline: boolean;
  lastSeen: Date;
  contacts: string[];
}

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
    },
    profilePicture: {
      type: String,
      default: "https://api.dicebear.com/9.x/avataaars/svg?seed=Kimberly",
    },
    contacts: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },
    ],
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.OFFLINE,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

export default mongoose.model<UserDocument>("User", userSchema);
