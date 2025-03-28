import { Router } from "express";
import * as userController from "../controllers/userControllers";

const router = Router();

router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);
router.get("/contact", userController.getContacts);
router.post("/contact", userController.addContact);

export default router;
