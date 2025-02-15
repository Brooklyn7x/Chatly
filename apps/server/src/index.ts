import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import conversationRoutes from "./routes/conversationRoutes";
import messageRoutes from "./routes/messageRoutes";
import { authenticate } from "./middleware/auth";
import { config } from "./config/config";
import { app, httpServer } from "./utils/socket";

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
// const socketService = SocketService.getInstance();
// const redis = RedisService.getInstance();

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", authenticate, userRoutes);
app.use("/api/chats", authenticate, conversationRoutes);
app.use("/api/messages", authenticate, messageRoutes);

httpServer.setMaxListeners(20);
httpServer.listen(config.port, () => {
  console.log(`Socket server running on port ${config.port}`);
});
