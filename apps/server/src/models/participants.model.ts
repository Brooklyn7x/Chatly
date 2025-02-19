import mongoose, { Schema } from "mongoose";
import { Participant, ParticipantRole } from "../types/conversation";

export interface IParticipantDocument extends Participant, Document {}

const ParticipantSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    role: {
      type: String,
      enum: Object.values(ParticipantRole),
      default: ParticipantRole.MEMBER,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    lastReadAt: {
      type: Date,
    },
  },
  { _id: false }
);
export const ConversationModel = mongoose.model<IParticipantDocument>(
  "Participant",
  ParticipantSchema
);
