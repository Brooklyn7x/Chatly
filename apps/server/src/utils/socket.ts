import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

export { io, httpServer, app };
