import { Router } from "express";
import { MessageController } from "../controllers/messageController";

const router = Router();
const controller = new MessageController();

router.get("/:conversationId", controller.getMessages);
router.post("/", controller.sendMessage);
router.delete("/:messageId", controller.deleteMessage);
router.post("/read", controller.markAsRead);

export default router;
