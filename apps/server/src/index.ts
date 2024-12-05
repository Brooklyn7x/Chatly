// import http from "http";
// import cors from "cors";
// import { createClient } from "redis";
// import express from "express";

// const app = express();
// const server = http.createServer(app);
// const client = createClient({ url: "redis://localhost:6379" });

// // Enable CORS for all routes
// app.use(
//   cors({
//     origin: "http://localhost:3001", // Replace with your frontend origin
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type"],
//     credentials: true, // Enable if you need to pass cookies or authorization headers
//   })
// );

// client
//   .connect()
//   .then(() => console.log("Connected to Redis"))
//   .catch((err: any) => console.error("Redis connection error:", err));

// // Sample data insertion for testing purposes
// async function setSampleData() {
//   await client.set("key", "Hello, Redis!");
// }
// setSampleData();

// app.get("/data", async (req, res) => {
//   try {
//     const value = await client.get("key"); // Fetch value from Redis
//     if (value) {
//       res.status(200).json({ message: value });
//     } else {
//       res.status(404).json({ message: "Data not found" });
//     }
//   } catch (err) {
//     console.error("Error fetching data from Redis:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Initialize the SocketManager for WebSocket handling
// const socketManager = new SocketManager(server);

// // Start the server and listen for HTTP & WebSocket requests
// server.listen(8000, () => {
//   console.log("Server running on http://localhost:8000");
// });

// // Gracefully handle Redis connection close on exit
// process.on("exit", () => {
//   client.quit();
// });

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";

import { config } from "./config/config";
import { ChatService } from "./services/chatService";
import authRoutes from "./routes/auth.route";
import contactRoutes from "./routes/contact.route";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.use(`/api/auth`, authRoutes);
app.use(`/api/contacts`, contactRoutes);

// const chatService = new ChatService(io);
// chatService.initializeSocket();

mongoose
  .connect(config.mongodb.url)
  .then(() => console.log("mongodb connected"))
  .catch((error) => console.log("MongoDB connection error:", error));

httpServer.listen(config.port, () => {
  console.log(`server started on ${config.port}`);
});
