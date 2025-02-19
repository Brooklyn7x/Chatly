import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import conversationRoutes from "./routes/conversationRoutes";
import messageRoutes from "./routes/messageRoutes";
import fileRouts from "./routes/fileRoutes";
import { authenticate } from "./middleware/auth";
import { config } from "./config/config";
import { app, httpServer } from "./utils/socket";

app.use(express.json());
// app.use(
//   cors({
//     origin: "*",
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.31.197:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", authenticate, userRoutes);
app.use("/api/chats", authenticate, conversationRoutes);
app.use("/api/messages", authenticate, messageRoutes);
app.use("/api/upload", authenticate, fileRouts);
httpServer.setMaxListeners(20);
httpServer.listen(Number(config.port), "0.0.0.0", () => {
  console.log(`Socket server running on port ${config.port}`);
});
