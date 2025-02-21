import { authenticate } from "../middleware/auth";
import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import conversationRoutes from "./conversationRoutes";
import messageRoutes from "./messageRoutes";
import fileRoutes from "./fileRoutes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/user", authenticate, userRoutes);
routes.use("/chats", authenticate, conversationRoutes);
routes.use("/messages", authenticate, messageRoutes);
routes.use("/upload", authenticate, fileRoutes);

export default routes;
