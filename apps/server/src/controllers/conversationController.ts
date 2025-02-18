import { Request, Response } from "express";
import { ConversationService } from "../services/conversationService";
import { BaseController } from "./baseController";
import { CreateConversationDTO } from "../types/conversation";

export class ConversationController extends BaseController {
  private readonly conversationService: ConversationService;

  constructor() {
    super("ConversationController");
    this.conversationService = new ConversationService();
    this.createConversation = this.createConversation.bind(this);
    this.getConversations = this.getConversations.bind(this);
    this.getConversations = this.getConversations.bind(this);
    this.deleteConversation = this.deleteConversation.bind(this);
    this.getConversationById = this.getConversationById.bind(this);
    this.updateConversation = this.updateConversation.bind(this);
    this.markAsRead = this.markAsRead.bind(this);
  }

  async createConversation(req: Request, res: Response): Promise<void> {
    try {
      const createDTO = req.body as CreateConversationDTO;

      if (
        !createDTO.type ||
        !createDTO.participantIds ||
        !Array.isArray(createDTO.participantIds)
      ) {
        res.status(400).json({
          success: false,
          error:
            "Invalid request format. Required: type and participantIds array",
        });
        return;
      }

      const result = await this.conversationService.createConversation(
        req.user._id,
        createDTO
      );

      if (!result.success) {
        res.status(400).json({
          success: false,
          error: result.error,
        });
        return;
      }

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to create chats",
      });
    }
  }

  async getConversations(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const result = await this.conversationService.getUserConversations(
        req.user!._id,
        limit,
        offset
      );
      res.json(result);
    } catch (error) {
      this.logger.error("Error fetching conversations:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch chats",
      });
    }
  }

  async getConversationById(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.conversationService.getConversationById(
        req.params.id
      );

      if (!result.success) {
        res.status(404).json(result);
        return;
      }

      res.json(result);
    } catch (error) {
      this.logger.error("Error fetching conversation:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch conversation",
      });
    }
  }

  async deleteConversation(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.conversationService.deleteConversation(
        req.params.id,
        req.user!._id
      );

      if (!result.success) {
        res.status(404).json(result);
        return;
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to delete conversation",
      });
    }
  }

  async updateConversation(req: Request, res: Response): Promise<void> {
    try {
      const updateData = req.body;
      const result = await this.conversationService.updateConversation(
        req.params.id,
        req.user!._id,
        updateData
      );

      if (!result.success) {
        const statusCode = result.error?.includes("not found") ? 404 : 400;
        res.status(statusCode).json(result);
        return;
      }

      res.json(result);
    } catch (error) {
      this.logger.error("Error updating conversation:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update conversation",
      });
    }
  }

  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.conversationService.markAsRead(
        req.params.id,
        req.user!._id
      );

      if (!result.success) {
        res.status(404).json(result);
        return;
      }

      res.json(result);
    } catch (error) {
      this.logger.error("Error marking conversation as read:", error);
      res.status(500).json({
        success: false,
        error: "Failed to mark conversation as read",
      });
    }
  }
}
