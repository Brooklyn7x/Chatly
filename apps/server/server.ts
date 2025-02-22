import { createServer } from "http";
import { Server } from "socket.io";
import app from "./src/app";
import logger from "./src/utils/loggers";
import mongoose from "mongoose";
import connectDB from "./src/config/db.js";
import { SocketService } from "./src/services/socketService";

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://192.168.31.197:3000"],
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  },
});

SocketService.getInstance();
connectDB();
//redis()
const PORT = parseInt(process.env.PORT || "8000", 10);
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

async function shutdown() {
  logger.info("Shutting down...");
  server.close();
  await mongoose.connection.close();
  // await redisClient.quit();
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection:", reason);
});

export { io };
