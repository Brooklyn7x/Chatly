import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "../schema/auth.schema";

const router = Router();
const controller = new AuthController();

router.post("/register", validate(registerSchema), controller.register);

router.post("/login", validate(loginSchema), controller.login);

// router.use(authenticate);

router.post(
  "refresh-token",
  validate(refreshTokenSchema),
  controller.refreshToken
);

router.post("/logout", controller.logout);

export default router;
