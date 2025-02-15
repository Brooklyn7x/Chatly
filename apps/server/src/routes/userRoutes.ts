import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();
const userController = new UserController();

router.get("/profile", userController.getUserProfile);
router.get("/profile", userController.updateProfile);
router.get("/search", userController.searchUsers)
router.get("/profile/:id", userController.getUserProfile);

export default router;
