import mongoose, { Schema, Document } from "mongoose";
import { IUser, UserStatus } from "../types/user";
interface IUserDefaults {
  defaultAvatars: string[];
}
const userDefaults: IUserDefaults = {
  defaultAvatars: [
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Kimberly",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Brooklynn",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Eden",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Oliver",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=George",
  ],
};

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
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
      minlength: 7,
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
    profilePicture: {
      type: String,
      default: function () {
        const avatars = userDefaults.defaultAvatars;
        return avatars[Math.floor(Math.random() * avatars.length)];
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ lastSeen: -1 });
export const UserModel = mongoose.model<IUserDocument>("User", userSchema);
