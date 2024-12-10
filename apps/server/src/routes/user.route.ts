import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();
const userController = new UserController();

router.get("/profile", userController.getUserProfile);
router.get("/profile/:userId", userController.getUserProfile);
router.post("/search", userController.searchUsers);

export default router; 
