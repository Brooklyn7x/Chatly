import { Router } from "express";
import { MessageController } from "../controllers/messageController";

const router = Router();
const controller = new MessageController();

//validate message
router.post("/create-message", controller.sendMessage);
router.delete("/:messageId", controller.deleteMessage);
router.post("/read", controller.markAsRead);

export default router;
