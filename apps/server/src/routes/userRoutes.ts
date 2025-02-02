import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();
const userController = new UserController();

// router.get("/");
router.get("/profile", userController.getUserProfile);
router.get("/profile/:userId", userController.getUserProfile);
router.get("/search", userController.searchUsers);

export default router;
