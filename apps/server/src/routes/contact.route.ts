import { ContactController } from "../controllers/contact.controller";
import { authenticate } from "../middleware/auth.middleware";
import { Router } from "express";
const router = Router();
const controller = new ContactController();

router.use(authenticate);

router.get("/get-all", controller.getContacts);

router.post("/add-contact", controller.addContact);

export default router;
