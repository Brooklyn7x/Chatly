import { Router } from "express";
import * as MessageController from "../controllers/messageControllers";

const router = Router();

router.get("/:conversationId", MessageController.getMessages);

export default router;
