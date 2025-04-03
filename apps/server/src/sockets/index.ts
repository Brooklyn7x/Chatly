import { Server } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";
import { userHandler } from "./userHandler";
import { messageHandler } from "./messageHandler";
import { chatHandler } from "./chatHandler";
import { conversationHandler } from "./conversationHandler";
import * as cookie from "cookie";

export const setupSocket = (server: any): void => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL as string,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const cookies = socket.request.headers.cookie;
      if (!cookies) return next(new Error("No cookies found"));

      const parsedCookies = cookie.parse(cookies);
      const token = parsedCookies.accessToken;

      if (!token) {
        return next(new Error("Access token not found"));
      }

      if (!process.env.JWT_ACCESS_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }
      const decode = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string
      ) as JwtPayload;

      socket.data.userId = decode.id;
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;
    socket.join(userId);
    console.log(`User connected: ${userId}`);

    socket.broadcast.emit("user_status_changes", {
      userId: socket.data.userId,
      status: "online",
    });

    conversationHandler(io, socket);
    userHandler(io, socket);
    chatHandler(io, socket);
    messageHandler(io, socket);

    socket.on("disconnect", () => {
      console.log("User disconnected");

      socket.broadcast.emit("user_status_changes", {
        userId: socket.data.userId,
        status: "offline",
      });
    });
  });
};
