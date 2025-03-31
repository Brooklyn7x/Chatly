import { Request, Response, NextFunction } from "express";
import logger from "../config/logger"; // Use a logger like winston or pino

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { statusCode, message } = err;

  // Handle Mongoose Validation Errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors).map((error: any) => error.message);
    message = `Validation Error: ${errors.join(", ")}`;
  }

  // Handle Mongoose Cast Errors (e.g., invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Handle Duplicate Key Errors (MongoError with code 11000)
  if (err.code === 11000) {
    statusCode = 409; // Conflict
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    message = `Duplicate value for field "${field}": "${value}". Please use a different value.`;
  }

  // Handle other Mongoose errors
  if (err.name === "MongoError") {
    statusCode = 500;
    message = "Database error occurred";
  }

  // Handle AppError (custom application errors)
  // if (err instanceof AppError) {
  //   statusCode = err.statusCode;
  //   message = err.message;
  // }

  // Log the error
  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode,
    path: req.originalUrl,
    method: req.method,
  });

  // Send error response
  res.status(statusCode || 500).json({
    success: false,
    message: message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
