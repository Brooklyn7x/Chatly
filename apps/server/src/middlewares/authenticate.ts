import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/error";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return next(new AppError(401, "Authentication token missing"));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    ) as jwt.JwtPayload;

    req.user = { id: decoded.id as string };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError(401, "Session expired. Please login again."));
    } else if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError(401, "Invalid authentication token"));
    } else {
      next(error);
    }
  }
};
