import { Request, Response } from "express";
import { FileService } from "../services/fileService";
import { SocketService } from "../services/socketService";
import { BaseController } from "./baseController";

export class FileController extends BaseController {
  private fileService: FileService;
  private socket: SocketService;

  constructor() {
    super("FileController");
    this.fileService = new FileService();
    this.socket = new SocketService();
    this.uploadFile = this.uploadFile.bind(this);
    this.getFile = this.getFile.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
  }

  async uploadFile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: "No file uploaded",
        });
        return;
      }

      const result = await this.fileService.uploadFile(
        req.file,
        req.user!._id,
        req.body.conversationId
      );

      // if (result.success) {
      //   this.socket.emitToConversation(
      //     req.body.conversationId,
      //     "file:uploaded",
      //     result.data
      //   );
      // }

      res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      this.logger.error("File upload error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  async getFile(req: Request, res: Response): Promise<void> {
    try {
      const fileId = req.params.id;
      const result = await this.fileService.getFile(req.user.id, fileId);

      if (!result.success) {
        res.status(404).json(result);
        return;
      }

      res.json(result);
    } catch (error) {
      this.logger.error("File fetch error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch file",
      });
    }
  }

  async deleteFile(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.fileService.deleteFile(
        req.params.id,
        req.user!._id
      );

      if (!result.success) {
        res.status(404).json(result);
        return;
      }

      if (result.data && result.data.conversationId) {
        // this.socket.emit("file:deleted", {
        //   conversationId: result.data.conversationId,
        //   fileId: req.params.id,
        // });
      }

      res.json(result);
    } catch (error) {
      this.logger.error("File deletion error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete file",
      });
    }
  }
}
