import { Router } from "express";
import * as authController from "../controllers/authControllers";

const router = Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/refresh-token", authController.refreshToken);

export default router;
