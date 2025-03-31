import { Server, Socket } from "socket.io";

interface UserStatus {
  status: "online" | "offline" | "away";
}

export const userHandler = (io: Server, socket: Socket) => {
  };
