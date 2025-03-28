import { Server, Socket } from "socket.io";

export const messageHandler = (io: Server, socket: Socket) => {
  socket.on("sendMessage", () => {});
  socket.on("markMessageRead", () => {});
  socket.on("markAllRead", () => {});
  socket.on("editMessage", () => {});
  socket.on("deleteMessage", () => {});
};
