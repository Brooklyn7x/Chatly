import { Document } from "mongoose";
import { IUser } from "./user.types";

export interface IContact extends Document {
  user: IUser["_id"];
  contact: IUser["_id"];
  status: ContactStatus;
  blocked: boolean;
  nickname?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ContactStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export interface IContactDto {
  userId: string;
  contactId: string;
  nickname?: string;
}
