import { Router } from "express";
import { ConversationController } from "../controllers/conversation.controller";

const router = Router();
const controller = new ConversationController();

//validateRequest

router.post("/create", controller.createConversation);
router.get("/user-conversations", controller.getUserConversations);
router.get("/", controller.getConversations);
router.delete("/delete", controller.deleteConversation);
// router.post("/:conversationId/read", controller.markAsRead);

export default router;
