import { Server, Socket } from "socket.io";

export const chatHandler = (io: Server, socket: Socket): void => {
  socket.on("joinChat", () => {});
  socket.on("leaveChat", () => {});
  socket.on("typingStart", () => {});
  socket.on("typingStop", () => {});
};
