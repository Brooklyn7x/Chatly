import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";
import conversationRoutes from "./routes/conversation.route";
import messageRoutes from "./routes/message.route";
import { authenticate } from "./middleware/auth.middleware";
import { config } from "./config/config";
import { SocketService } from "./services/socket.service";
import { app, httpServer } from "./utils/socket";

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const socketService = SocketService.getInstance();

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.use("/auth", authRoutes);
app.use("/users", authenticate, userRoutes);
app.use("/conversations", authenticate, conversationRoutes);
app.use("/messages", authenticate, messageRoutes);

httpServer.setMaxListeners(20);

httpServer.listen(config.port, () => {
  console.log(`Socket server running on port ${config.port}`);
});
