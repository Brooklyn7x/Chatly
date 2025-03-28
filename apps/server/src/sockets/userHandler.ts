import { Server, Socket } from "socket.io";
import { UserStatus } from "../types/user";

export const userHandler = (io: Server, socket: Socket) => {
  socket.broadcast.emit("user:status_change", {
    userId: socket.data.user.userId,
    status: UserStatus.ONLINE,
  });
};
