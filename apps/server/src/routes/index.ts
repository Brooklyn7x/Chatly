import { authenticate } from "../middlewares/authenticate";
import { Router } from "express";

import userRoutes from "./userRoutes";
import conversationRoutes from "./conversationRoutes";
import messageRoutes from "./messageRoutes";

const routes = Router();

// routes.use("/auth", authRoutes);
routes.use("/user", authenticate, userRoutes);
routes.use("/chats", authenticate, conversationRoutes);
routes.use("/messages", authenticate, messageRoutes);

export default routes;
