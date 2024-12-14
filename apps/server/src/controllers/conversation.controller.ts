import { Request, Response } from "express";
import { ConversationService } from "../services/conversation.service";
import { BaseController } from "./base.controller";

export class ConversationController extends BaseController {
  private conversationService: ConversationService;

  constructor() {
    super("ConversationController");
    this.conversationService = new ConversationService();
  }

  async createConversation(req: Request, res: Response): Promise<void> {
    try {
      //   const validateResult = validateRequest(req.body, "createConversation");

      //   if (!validationResult.success) {
      //     res.status(400).json({
      //       success: false,
      //       error: validationResult.error,
      //     });
      //     return;
      //   }

      const result = await this.conversationService.createConversation(
        req.user!.id,
        req.body
      );

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to create conversation",
      });
    }
  }

  async getConversations(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const result = await this.conversationService.getUserConversations(
        req.user!.id,
        limit,
        offset
      );

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch conversations",
      });
    }
  }

  async getConversation(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.conversationService.getConversation(
        req.params.conversationId,
        req.user!.id
      );

      if (!result.success) {
        res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch conversation",
      });
    }
  }

  //   async updateConversation(req: Request, res: Response): Promise<void> {
  //     try {
  //       const validationResult = validateRequest(req.body, "updateConversation");

  //       if (!validationResult.success) {
  //         res.status(400).json({
  //           success: false,
  //           error: validationResult.error,
  //         });
  //         return;
  //       }

  //       const result = await this.conversationService.updateConversation(
  //         req.params.conversationId,
  //         req.user!.id,
  //         req.body as UpdateConversationDTO
  //       );

  //       if (!result.success) {
  //         res.status(404).json(result);
  //         return;
  //       }

  //       res.json(result);
  //     } catch (error) {
  //       res.status(500).json({
  //         success: false,
  //         error: "Failed to update conversation",
  //       });
  //     }
  //   }

  // async markAsRead(req: Request, res: Response): Promise<void> {
  //   try {
  //     const result = await this.conversationService.markConversationAsRead(
  //       req.params.conversationId,
  //       req.user!.id
  //     );

  //     if (!result.success) {
  //       res.status(404).json(result);
  //       return;
  //     }

  //     res.json(result);
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       error: "Failed to mark conversation as read",
  //     });
  //   }
  // }
}
