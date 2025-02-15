import { Router } from "express";
import { ConversationController } from "../controllers/conversationController";

const router = Router();
const controller = new ConversationController();

router.get("/", controller.getAllConversations);
router.post("/", controller.createConversation);
router.get("/:id", controller.getConversations);
router.delete("/:id", controller.deleteConversation);
router.put("/:id", controller.updateConversation)

export default router;
