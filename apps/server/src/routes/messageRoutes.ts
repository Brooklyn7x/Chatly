import { Router } from "express";
import { MessageController } from "../controllers/messageController";

const router = Router();
const controller = new MessageController();

router.get("/:id", controller.getMessages);
router.delete("/:messageId", controller.deleteMessage);
router.put("/:id", controller.updateMessage)


export default router;
