import { createServer } from "http";
import app from "./app";
import mongoose from "mongoose";
import connectDB from "./src/config/db.js";
import { setupSocket } from "./src/sockets";

const PORT = parseInt(process.env.PORT || "8000");

connectDB();

const server = createServer(app);
setupSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

async function shutdown() {
  console.log("Shutting down...");
  server.close();
  await mongoose.connection.close();
  // await redisClient.quit();
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

//  export { io };

// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:3000", "http://192.168.31.197:3000"],
//     methods: ["GET", "POST"],
//     credentials: true,
//     allowedHeaders: ["Authorization", "Content-Type"],
//   },
// });
