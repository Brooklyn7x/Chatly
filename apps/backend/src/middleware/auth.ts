import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { UserModel } from "../models/user.model";
import { AppError } from "../utils/error";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new AppError(401, "No auth token provided");
    }

    const decoded = jwt.verify(token, config.jwt.secret!) as {
      userId: string;
    };

    const user = await UserModel.findById(decoded.userId).select("-password");
    if (!user) {
      throw new AppError(401, "Invalid token - user not found");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError(401, "Token expired"));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, "Invalid token"));
    } else {
      next(error);
    }
  }
};
