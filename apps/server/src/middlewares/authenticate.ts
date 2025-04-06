import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/error";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token =
      req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError(401, "No authentication token provided");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    ) as jwt.JwtPayload;

    req.user = { id: decoded.id as string };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return next(new AppError(401, "Session expired. Please login again."));
      }

      try {
        const decodedRefresh = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET as string
        ) as jwt.JwtPayload;

        req.user = { id: decodedRefresh.id as string };
        next();
      } catch (refreshError) {
        return next(new AppError(401, "Invalid session. Please login again."));
      }
    } else if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError(401, "Invalid authentication token"));
    } else {
      next(error);
    }
  }
};
