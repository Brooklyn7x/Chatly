import { Router } from "express";
import { ConversationController } from "../controllers/coversationController";

const router = Router();
const controller = new ConversationController();

router.post("/", controller.createConversation);
router.get("/", controller.getConversations);
router.get("/:id", controller.getConversationById);
router.put("/:id", controller.updateConversation);
router.patch("/:id/read", controller.markAsRead);
router.delete("/:id", controller.deleteConversation);

export default router;
