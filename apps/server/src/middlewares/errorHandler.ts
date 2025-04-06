import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { statusCode, message } = err;

  if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors).map((error: any) => error.message);
    message = `Validation Error: ${errors.join(", ")}`;
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    message = `Duplicate value for field "${field}": "${value}". Please use a different value.`;
  }

  if (err.name === "MongoError") {
    statusCode = 500;
    message = "Database error occurred";
  }

  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode,
    path: req.originalUrl,
    method: req.method,
  });

  res.status(statusCode || 500).json({
    success: false,
    message: message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
