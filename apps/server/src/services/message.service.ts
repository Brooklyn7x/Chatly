import Redis from "ioredis";
import { DatabaseService } from "./database.service";
import {
  CreateMessageDTO,
  Message,
  MessageStatus,
} from "../types/message";
import { ServiceResponse } from "../types/service-respone";
import { BaseService } from "./base.service";
import mongoose from "mongoose";
import { MessageModel } from "../models/message.model";

export class MessageService extends BaseService {
  private redis: Redis;
  private db: DatabaseService;

  constructor() {
    super("MessageService");
    this.redis = new Redis(process.env.REDIS_URL as string);
    this.db = new DatabaseService();
  }

  async sendMessage(
    senderId: string,
    messageData: CreateMessageDTO
  ): Promise<ServiceResponse<any>> {
    try {
      console.log("sending message Received", messageData)
      const conversation = await this.db.findOne<any>("Conversation", {
        _id: new mongoose.Types.ObjectId(messageData.conversationId),
        "participants.userId": senderId,
      });

      if (!conversation) {
        return {
          success: false,
          error: "Conversation not found or unauthorized",
        };
      }

      const messageObj: Partial<Message> = {
        conversationId: new mongoose.Types.ObjectId(
          messageData.conversationId
        ).toString(),
        senderId: new mongoose.Types.ObjectId(senderId).toString(),
        content: messageData.content,
        type: messageData.type,
        status: MessageStatus.SENDING,
        timestamp: new Date(),
      };

      if (conversation.type === "direct") {
        const receiver = conversation.participants.find(
          (p: any) => p.userId.toString() !== senderId
        );

        messageObj.receiverId = receiver.userId;
      } else if (conversation.type === "group") {
        const receiver = conversation.participants.find(
          (p: any) => p.userId.toString() !== senderId
        );
        messageObj.receiverId = receiver.userId;
        messageObj.deliveredTo = [
          {
            userId: receiver.userId,
            deliveredAt: new Date(),
          },
        ];
      }
      const message = new MessageModel(messageObj);
      const storedMessage = await message.save();

      // await this.cacheMessage(storedMessage);

      message.status = MessageStatus.SENT;
      await this.updateMessageStatus(message.id, MessageStatus.SENT);
      // await this.sendRealTimeUpdate(message);
      // await this.updateConversation(message);

      return {
        success: true,
        data: storedMessage,
      };
    } catch (error) {
      this.logger.error("Error creating message:", error);
      return {
        success: false,
        error: "Failed to create message",
      };
    }
  }

  async getMessages(
    conversationId: string,
    limit: number = 20,
    before?: Date
  ): Promise<ServiceResponse<any[]>> {
    try {
      // const cacheKey = `messages:${conversationId}`;
      // const cacheMessage = await this.getCacheMessage(cacheKey, limit);
      // if (cacheMessage.length === limit) {
      //   return {
      //     success: true,
      //     data: cacheMessage,
      //   };
      // }

      const query = before
        ? { conversationId, timestamp: { $lt: before } }
        : { conversationId };

      const message = await this.db.find("Message", query, {
        sort: { timestamp: -1 },
        limit,
      });

      console.log("fetched messages:", message);

      // await this.cacheMessage(message);

      return {
        success: true,
        data: message,
      };
    } catch (error) {
      this.logger.error("Error fetching messages:", error);
      return {
        success: false,
        error: "Failed to fetch messages",
      };
    }
  }

  async deleteMessage(messageId: string, userId: string) {
    try {
      const message = await MessageModel.findOne({
        _id: new mongoose.Types.ObjectId(messageId).toString(),
        senderId: new mongoose.Types.ObjectId(userId).toString(),
      });

      if (!message) {
        return {
          success: false,
          error: "Message not found",
        };
      }

      const deleteMessage = await MessageModel.deleteOne({
        _id: new mongoose.Types.ObjectId(messageId).toString(),
      });
      if (!deleteMessage.deletedCount) {
        return {
          success: false,
          error: "Failed to delete message",
        };
      }
      // await this.redis.del(`message:${messageId}`);
      return {
        success: true,
      };
    } catch (error) {
      this.logger.error("Error deleting message:", error);
      return {
        success: false,
        error: "Failed to delete message",
      };
    }
  }

  // async updateMessageStatus(messageId: string, status: MessageStatus) {
  //   try {
  //     console.log(messageId, "message ids");
  //     const updatedMessage = await MessageModel.findByIdAndUpdate(
  //       messageId,
  //       {
  //         $set: {
  //           status: status,
  //           updatedAt: new Date(),
  //         },
  //       },
  //       { new: true }
  //     );
  //     if (!updatedMessage) {
  //       return {
  //         success: false,
  //         error: "Message not found",
  //       };
  //     }

  //     return {
  //       success: true,
  //       data: updatedMessage,
  //     };
  //   } catch (error) {
  //     this.logger.error("Error updating message status", error);
  //     return {
  //       success: false,
  //       error: "Failed to update message status",
  //     };
  //   }
  // }

  async updateMessageStatus(messageId: string, status: MessageStatus) {
    try {
      if (!mongoose.isValidObjectId(messageId)) {
        this.logger.error(`Invalid message ID format: ${messageId}`);
        return {
          success: false,
          error: "Invalid message ID format",
        };
      }

      const updatedMessage = await MessageModel.findByIdAndUpdate(
        new mongoose.Types.ObjectId(messageId),
        {
          $set: {
            status: status,
            updatedAt: new Date(),
          },
        },
        { new: true }
      );

      if (!updatedMessage) {
        return {
          success: false,
          error: "Message not found",
        };
      }

      return {
        success: true,
        data: updatedMessage,
      };
    } catch (error) {
      this.logger.error("Error updating message status:", error);
      return {
        success: false,
        error: "Failed to update message status",
      };
    }
  }

  async markMessageAsRead(
    messageId: string,
    userId: string
  ): Promise<ServiceResponse<any>> {
    try {
      const message = await MessageModel.findById(messageId);

      if (!message) {
        return {
          success: false,
          error: "Message not found",
        };
      }

      if (message.receiverId?.toString() !== userId) {
        return {
          success: false,
          error: "Unauthorized to mark this message as read",
        };
      }

      const updatedMessage = await MessageModel.findByIdAndUpdate(
        messageId,
        {
          $set: {
            status: MessageStatus.READ,
            readAt: new Date(),
            "deliveryStatus.read": new Date(),
          },
        },
        { new: true }
      );

      if (!updatedMessage) {
        return {
          success: false,
          error: "Failed to update message status",
        };
      }
      return { success: true, data: updatedMessage };
    } catch (error) {
      this.logger.error("Error marking message as read:", error);
      return {
        success: false,
        error: "Failed to mark message as read",
      };
    }
  }

  // private async cacheMessage(message: any): Promise<void> {
  //   const pipeline = this.redis.pipeline();
  //   pipeline.hset(`message:${message.id}`, this.serializeMessage(message));
  //   pipeline.zadd(
  //     `message:${message.conversationId}`,
  //     message.timestamp.getTime(),
  //     message.id
  //   );
  //   pipeline.expire(`message:${message.id}`, 86400);
  //   pipeline.expire(`message:${message.conversationId}`, 86400);
  //   await pipeline.exec();
  // }

  // private async getCacheMessage(
  //   conversationId: string,
  //   limit: number
  // ): Promise<Message[]> {
  //   const messageIds = await this.redis.zrevrange(
  //     `message:${conversationId}`,
  //     0,
  //     limit - 1
  //   );
  //   const message = await Promise.all(
  //     messageIds.map(async (id) => {
  //       const messageData = await this.redis.hgetall(`message:${id}`);
  //       return this.deserializeMessage(messageData);
  //     })
  //   );

  //   return message.filter(Boolean);
  // }

  // private serializeMessage(message: Message): Record<string, string> {
  //   return {
  //     id: message.id,
  //     conversationId: message.conversationId,
  //     senderId: message.senderId,
  //     receiverId: message.receiverId,
  //     content: message.content,
  //     type: message.type,
  //     status: message.status,
  //     timestamp: message.timestamp ? message.timestamp.toISOString() : "",
  //     metadata: message.metadata ? JSON.stringify(message.metadata) : "",
  //   };
  // }

  //}
}
