import { Router } from "express";
import { FileController } from "../controllers/fileController";

const router = Router();
const controller = new FileController();

router.post("/", controller.uploadFile);
router.get("/:id", controller.getFile);
router.delete("/:id", controller.deleteFile);
