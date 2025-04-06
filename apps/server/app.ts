import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/authRoutes";
import userRoutes from "./src/routes/userRoutes";
import conversationRoutes from "./src/routes/conversationRoutes";
import messageRoutes from "./src/routes/messageRoutes";
import { errorHandler } from "./src/middlewares/errorHandler";
import { RateLimiter } from "./src/middlewares/rateLimiter";
import { authenticate } from "./src/middlewares/authenticate";
import "dotenv/config";

const app = express();
app.use(cookieParser());
app.use(helmet());
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL as string,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(RateLimiter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", authenticate, userRoutes);
app.use("/api/conversations", authenticate, conversationRoutes);
app.use("/api/messages", authenticate, messageRoutes);
app.use(errorHandler);

export default app;
