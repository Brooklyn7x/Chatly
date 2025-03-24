import { Server, Socket } from "socket.io";
import { UserStatus } from "../types/user";

export const userSocket = (io: Server, socket: Socket) => {
  console.log(socket.data.user);
  console.log("User socket initialized for user:", socket.data.user.userId);

  socket.broadcast.emit("user:status_change", {
    userId: socket.data.user.userId,
    status: UserStatus.ONLINE,
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.data.user.userId}`);
    socket.broadcast.emit("user:status_change", {
      userId: socket.data.user.userId,
      status: UserStatus.OFFLINE,
    });
  });
};
