import mongoose, { Schema } from "mongoose";
import { ContactStatus, IContact } from "../types/types.contact";
import { boolean } from "zod";

const contactSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    contact: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(ContactStatus),
      default: ContactStatus.PENDING,
      index: true,
    },
    blocked: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

contactSchema.index({ user: 1, contact: 1 }, { unique: true });

export const Contact = mongoose.model<IContact>("Contact", contactSchema);
