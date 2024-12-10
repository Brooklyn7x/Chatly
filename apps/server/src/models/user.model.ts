import mongoose, { Schema, Document } from "mongoose";
import { UserStatus } from "../types/user.types";

export interface IUser {
  username: string;
  email: string;
  password: string;
  status: UserStatus;
  lastSeen: Date;
  profilePicture?: string;
}

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
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
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.OFFLINE,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    profilePicture: String,
  },
  {
    timestamps: true,
  }
);

// Create and export the model
export const UserModel = mongoose.model<IUserDocument>("User", userSchema);
