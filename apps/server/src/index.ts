import express from "express";
import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";
import conversationRoutes from "./routes/conversation.route";
import messageRoutes from "./routes/message.route";
import { authenticate } from "./middleware/auth.middleware";
import { httpServer } from "./utils/socket";
import { config } from "./config/config";
import "./services/socket.service";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.use("/auth", authRoutes);
app.use("/users", authenticate, userRoutes);
// app.use("/conversation", authenticate, conversationRoutes);
// app.use("/message", authenticate, messageRoutes);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
