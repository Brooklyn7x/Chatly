import { Router } from "express";
import * as authController from "../controllers/authController";
import { validate } from "../middlewares/validation";
import { registerSchema, loginSchema } from "../schemas/authSchemas";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refreshToken);
router.get("/google", authController.googleLogin);
router.get("/google/callback", ...authController.googleCallback);

export default router;
