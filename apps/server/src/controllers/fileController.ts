import { Request, Response } from "express";
import { FileService } from "../services/fileService";
import { BaseController } from "./baseController";
import { FileStatus } from "../models/file";

export class FileController extends BaseController {
  private fileService: FileService;

  constructor() {
    super("FileController");
    this.fileService = new FileService();
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
        {
          type: req.body.contextType,
          id: req.body.contextId,
          purpose: req.body.purpose,
        }
      );

      res.status(201).json({
        success: true,
        data: {
          ...result.data,
          message:
            result.data.status === FileStatus.PROCESSING
              ? "File is being processed"
              : "File ready",
        },
      });
    } catch (error) {
      this.logger.error("File upload error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  async uploadAvatar() {}
  async uploadAttachments() {}
  async uploadBanner() {}

  async getFile(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.fileService.getFile(
        req.params.id,
        req.user!._id
      );

      if (!result.success) {
        res.status(404).json(result);
        return;
      }

      res.json({
        success: true,
        data: {
          ...result.data,
          url: result.data.status === FileStatus.READY ? result.data.url : null,
          thumbnail:
            result.data.status === FileStatus.READY
              ? result.data.versions.thumbnail
              : null,
        },
      });
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
