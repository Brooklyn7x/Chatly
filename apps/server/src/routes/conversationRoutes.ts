import { Router } from "express";
import { ConversationController } from "../controllers/conversationController";

const router = Router();
const controller = new ConversationController();

router.get("/", controller.getConversations);
router.post("/", controller.createConversation);
router.get("/user-chats", controller.getUserConversations);
router.delete("/:conversationId", controller.deleteConversation);
// router.post("/:conversationId/read", controller.markAsRead);

export default router;
