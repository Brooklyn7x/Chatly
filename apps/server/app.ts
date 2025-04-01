import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./src/routes";
import authRoutes from "./src/routes/authRoutes";
import userRoutes from "./src/routes/userRoutes";
import conversationRoutes from "./src/routes/conversationRoutes";
import messageRoutes from "./src/routes/messageRoutes";
import { errorHandler } from "./src/middlewares/errorHandler";
import { RateLimiter } from "./src/middlewares/rateLimiter";
import { authenticate } from "./src/middlewares/authMiddleware";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use(RateLimiter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// app.use("/api", routes);
app.use("/api/auth", authRoutes);
app.use("/api/user", authenticate, userRoutes);
app.use("/api/conversations", authenticate, conversationRoutes);
app.use("/api/messages", authenticate, messageRoutes);
app.use(errorHandler);

export default app;
