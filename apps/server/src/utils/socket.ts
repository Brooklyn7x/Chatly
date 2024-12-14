import { Server } from "socket.io";
import { createServer } from "http";

const httpServer = createServer();

export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

export { httpServer };
