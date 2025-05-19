import { UserDocument } from "../models/user";
import { IUser } from "./user";

declare global {
  namespace Express {
    interface User extends UserDocument {
      id: string;
    }

    interface Request {
      user?: User;
    }
  }
}
