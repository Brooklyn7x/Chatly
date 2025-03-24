import { Server } from "socket.io";
import { chatSocket } from "./chatSocket";
import jwt from "jsonwebtoken";
import { userSocket } from "./userSocket";
import { messageSocket } from "./messageSocket";

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
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    chatSocket(io, socket);
    userSocket(io, socket);
    messageSocket(io, socket);
  });
};
