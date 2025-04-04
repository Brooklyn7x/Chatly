import { Router } from "express";
import * as authController from "../controllers/authController";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshToken);

export default router;
