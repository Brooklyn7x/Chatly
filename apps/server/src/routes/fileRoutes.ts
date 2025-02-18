import { Router } from "express";
import { FileController } from "../controllers/fileController";
import multer from "multer";

const router = Router();
const controller = new FileController();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), controller.uploadFile);
router.get("/:id", controller.getFile);
router.delete("/:id", controller.deleteFile);

export default router;
