import { Router } from "express";
import { ConversationController } from "../controllers/conversation.controller";

const router = Router();
const controller = new ConversationController();

//validateRequest
router.post("/create", controller.createConversation);
router.get("/user-conversation", controller.getConversations);
router.get("/:conversationId", controller.getConversation);
// router.post("/:conversationId/read", controller.markAsRead);

export default router;
