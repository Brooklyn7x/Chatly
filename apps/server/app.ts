import express from "express";
import "./instrument";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/authRoutes";
import userRoutes from "./src/routes/userRoutes";
import conversationRoutes from "./src/routes/conversationRoutes";
import messageRoutes from "./src/routes/messageRoutes";
import { errorHandler } from "./src/middlewares/errorHandler";
import { RateLimiter } from "./src/middlewares/rateLimiter";
import { authenticate } from "./src/middlewares/authenticate";

import * as Sentry from "@sentry/node";

const app = express();

app.use(cookieParser());
app.use(helmet());
app.use(express.json());

app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] Worker ${process.pid} handling ${req.method} ${req.originalUrl}`
  );
  next();
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL as string,
    credentials: true,
  })
);

app.use(RateLimiter);

app.get("/health", (req, res) => {
  res.send("ok");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", authenticate, userRoutes);
app.use("/api/conversations", authenticate, conversationRoutes);
app.use("/api/messages", authenticate, messageRoutes);
Sentry.setupExpressErrorHandler(app);
app.use(errorHandler);
export default app;
