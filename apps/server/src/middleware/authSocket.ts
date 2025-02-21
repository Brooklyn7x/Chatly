import jwt from "jsonwebtoken";
import { NextFunction } from "express";
import { Socket } from "socket.io";
import logger from "../utils/loggers";

export function authSocket(socket: Socket, next: (err?: Error) => void) {
  const token = socket.handshake.auth.token;
  if (!token) {
    logger.warn("No token provided for socket connection");
    return next(new Error("No authentication token"));
  }
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.data.user = decoded;
    next();
  } catch (error) {
    logger.error("Socket authentication error:", error);
    next(new Error("Invalid authentication token"));
  }
}
