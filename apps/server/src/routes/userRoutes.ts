import { Router } from "express";
import * as userController from "../controllers/userController";
import { validate } from "../middlewares/validation";
import {
  addContactSchema,
  searchUsersSchema,
  updateProfileSchema,
} from "../schemas/userSchemas";

const router = Router();

router.get("/me", userController.me);
router.put(
  "/profile",
  validate(updateProfileSchema),
  userController.updateProfile
);
router.get("/contact", userController.getContacts);
router.post("/contact", validate(addContactSchema), userController.addContact);
router.get("/search", validate(searchUsersSchema), userController.searchUsers);

export default router;
