import { Router } from "express";
import * as conversationController from "../controllers/conversationController";
const router = Router();

router.post("/", conversationController.createConversation);
router.get("/", conversationController.getConversations);
router.put("/participants", conversationController.addParticipants);
router.delete("/participants", conversationController.removeParticipants);
router.put("/:id", conversationController.updateConversation);
router.delete("/:id", conversationController.deleteConversation);

export default router;
