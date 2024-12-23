import { Request, Response } from "express";
import { ConversationService } from "../services/conversation.service";
import { MessageService } from "../services/message.service";
import { SocketService } from "../services/socket.service";
import { BaseController } from "./base.controller";
import { CreateMessageDTO } from "../types/message";

export class MessageController extends BaseController {
  private messageService: MessageService;
  private conversationService: ConversationService;
  private socket: SocketService;

  constructor() {
    super("MessageController");
    this.conversationService = new ConversationService();
    this.socket = new SocketService();
    this.messageService = new MessageService();
  }

  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      // const validationResult = validateRequest(
      //     req.body,
      //     'createMessage'
      // );
      // if (!validationResult.success) {
      //     res.status(400).json({
      //         success: false,
      //         error: validationResult.error
      //     });
      //     return;
      // }

      const result = await this.messageService.createMessage(
        req.user!._id,
        req.body as CreateMessageDTO
      );
      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      await this.socket.broadcastMessage("newMessage", result.data);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to send message",
      });
    }
  }

  async getMessage(req: Request, res: Response): Promise<void> {
    try {
      const conversationId = req.params.conversationId;
      const limit = parseInt(req.query.limit as string) || 20;
      const before = req.query.before as string;

      //conversationAccess

      const result = await this.messageService.getMessages(
        conversationId,
        limit,
        before ? new Date(before) : undefined
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch messages",
      });
    }
  }

  async deleteMessage(req: Request, res: Response): Promise<void> {
    // try {
    //   const result = await this.messageService.deleteMessage(
    //     req.params.messageId,
    //     req.user!.id
    //   );
    //   if (!result.success) {
    //     res.status(404).json(result);
    //     return;
    //   }
    //   res.json(result);
    // } catch (error) {
    //   res.status(500).json({
    //     success: false,
    //     error: "Failed to delete message",
    //   });
    // }
  }

  async updateMessage(req: Request, res: Response): Promise<void> {}

  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const messageIds = req.body.messageIds as string[];

      // const result = await this.conversationService.markConversationAsRead(
      //   messageIds,
      //   req.user!.id
      // );
    } catch (error) {}
  }
}
