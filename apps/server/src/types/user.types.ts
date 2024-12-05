import { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  comparePassword(password: string): Promise<boolean>;
}

export interface IUpdateUserData {
  name?: string;
  email?: string;
}

export interface ISearchQuery {
  search?: string;
  page?: number;
  limit?: number;
}
