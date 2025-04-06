import { Router } from "express";
import * as MessageController from "../controllers/messageController";
import { validate } from "../middlewares/validation";
import { getMessagesSchema } from "../schemas/messageSchemas";

const router = Router();

router.get(
  "/:conversationId",
  validate(getMessagesSchema),
  MessageController.getMessages
);

export default router;
