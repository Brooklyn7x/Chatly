import { Server, Socket } from "socket.io";
import Conversation from "../models/conversation";

export const chatHandler = (io: Server, socket: Socket): void => {
  socket.on("chat_join", async (chatId: string) => {
    try {
      console.log("chat_join", chatId);

      const chat = await Conversation.findById(chatId);
      if (!chat) {
        socket.emit("error", { message: "Conversation not found" });
      }

      const isMember = chat?.participants?.some(
        (participant) => participant.userId.toString() === socket.data.userId
      );

      if (!isMember) {
        socket.emit("error", {
          message: "You are not a member of this conversation",
        });
        return;
      }

      socket.join(chatId);
      console.log(`User ${socket.data.userId} joined chat: ${chatId}`);

      io.to(chatId).emit("chat_joined", {
        userId: socket.data.userId,
        chatId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      socket.emit("error", { message: "Error in joining room", error });
    }
  });

  socket.on("chat_left", (chatId: string) => {
    try {
      socket.leave(chatId);
      console.log("chat_left", chatId);
      socket.to(chatId).emit("chat:leaved", {
        userId: socket.data.userId,
        chatId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      socket.emit("error", { message: "Error in leaving room", error });
    }
  });

  socket.on("typing_start", (chatId: string) => {
    try {
      socket.to(chatId).emit("typing_start", {
        chatId,
        userId: socket.data.userId,
      });
    } catch (error) {
      console.log("Error with typing indicator", error);
    }
  });

  socket.on("typing_stop", (chatId: string) => {
    try {
      socket.to(chatId).emit("typing_stop", {
        chatId,
        userId: socket.data.userId,
      });
    } catch (error) {
      socket.emit("error", { message: "error with typing" });
      console.log("Error with typing indicator", error);
    }
  });
};
