import { Server } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";
import { userHandler } from "./userHandler";
import { messageHandler } from "./messageHandler";
import { chatHandler } from "./chatHandler";

export const setupSocket = (server: any): void => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authencation error"));
    }

    try {
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
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.broadcast.emit("user_status_changes", {
      userId: socket.data.userId,
      status: "online",
    });

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
