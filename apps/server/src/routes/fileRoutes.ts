import { Router } from "express";
import { FileController } from "../controllers/fileController";
import multer from "multer";

const router = Router();
const controller = new FileController();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/avatars", upload.single("file"), controller.uploadAvatar);
router.post(
  "/attachments",
  upload.single("file"),
  controller.uploadAttachments
);
router.post("/banners", upload.single("file"), controller.uploadBanner);
router.get("/:id", controller.getFile);
router.delete("/:id", controller.deleteFile);

export default router;
