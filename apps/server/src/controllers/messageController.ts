// import { Request, Response } from "express";
// import { MessageService } from "../services/messageService";
// import { BaseController } from "./baseController";

// export class MessageController extends BaseController {
//   private messageService: MessageService;

//   constructor() {
//     super("MessageController");

//     this.messageService = new MessageService();
//     this.sendMessage = this.sendMessage.bind(this);
//     this.deleteMessage = this.deleteMessage.bind(this);
//     this.getMessages = this.getMessages.bind(this);
//   }

//   async sendMessage(req: Request, res: Response): Promise<void> {
//     try {
//       // const validationResult = validateRequest(
//       //     req.body,
//       //     'createMessage'
//       // );
//       // if (!validationResult.success) {
//       //     res.status(400).json({
//       //         success: false,
//       //         error: validationResult.error
//       //     });
//       //     return;
//       // }
//       console.log("Creating message:", req.body);
//       const result = await this.messageService.sendMessage(
//         req.user!._id,
//         req.body
//       );

//       if (!result.success) {
//         res.status(400).json(result);
//         return;
//       }

//       // await this.socket.broadcastMessage("newMessage", result.data);
//       res.status(201).json(result);
//     } catch (error) {
//       this.logger.error("Error sending message:", error);
//       res.status(500).json({
//         success: false,
//         error: "Failed to send message",
//       });
//     }
//   }

//   async getMessages(req: Request, res: Response): Promise<void> {
//     try {
//       console.log(req.params);
//       const chatId = req.params.id;
//       const limit = parseInt(req.query.limit as string) || 10;
//       const before = req.query.before as string;

//       const result = await this.messageService.getMessages(
//         chatId,
//         limit,
//         before ? new Date(before) : undefined
//       );

//       if (!result.success) {
//         res.status(400).json(result);
//         return;
//       }
//       res.status(200).json(result);
//     } catch (error) {
//       this.logger.error("Failed to fetch messages:", error);
//       res.status(500).json({
//         success: false,
//         error: "Failed to fetch messages",
//       });
//     }
//   }

//   async deleteMessage(req: Request, res: Response): Promise<void> {
//     try {
//       const result = await this.messageService.deleteMessage(
//         req.params.messageId,
//         req.user!._id
//       );

//       if (!result.success) {
//         res.status(400).json(result);
//         return;
//       }
//       res.json(result);
//     } catch (error) {
//       this.logger.error("Error deleting message:", error);
//       res.status(500).json({
//         success: false,
//         error: "Failed to delete message",
//       });
//     }
//   }

//   async updateMessage(req: Request, res: Response): Promise<void> {}

//   async markAsRead(req: Request, res: Response): Promise<void> {
//     try {
//       const messageIds = req.body.messageIds as string[];

//       // const result = await this.conversationService.markConversationAsRead(
//       //   messageIds,
//       //   req.user!.id
//       // );
//     } catch (error) {}
//   }
// }
