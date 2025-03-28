// import Redis from "ioredis";
// import { Message, MessageStatus, MessageType } from "../types/message";
// import { ServiceResponse } from "../types/service-respone";
// import mongoose from "mongoose";
// import { MessageModel } from "../models/message";
// import { Logger } from "../utils/logger";
// import redisClient from "../config/redis";

// interface MessageData {
//   conversationId: string;
//   content?: string;
//   type?: MessageType;
//   metadata?: Record<string, any>;
//   replyTo?: string | null;
//   attachments?: Array<{
//     url: string;
//     type: string;
//     name?: string;
//     size?: number;
//     mimeType?: string;
//   }>;
//   tempId?: string;
// }

// export class MessageService {
//   private logger: Logger;
//   constructor() {
//     this.logger = new Logger();
//   }

//   async sendMessage(
//     senderId: string,
//     messageData: MessageData
//   ): Promise<ServiceResponse<any>> {
//     try {
//       // console.log(messageData, "messageData");
//       // const conversation = await MessageModel.findOne({
//       //   _id: new mongoose.Types.ObjectId(messageData.conversationId),
//       // });

//       // if (!conversation) {
//       //   return {
//       //     success: false,
//       //     error: "Conversation not found",
//       //   };
//       // }

//       const messageObj = {
//         conversationId: messageData.conversationId,
//         senderId: new mongoose.Types.ObjectId(senderId),
//         content: messageData.content,
//         type: messageData.type || MessageType.TEXT,
//         status: MessageStatus.SENDING,
//         metadata: messageData.metadata || {},
//         attachments: messageData.attachments,
//         replyTo: messageData.replyTo
//           ? new mongoose.Types.ObjectId(messageData.replyTo)
//           : null,
//       };

//       const message = new MessageModel(messageObj);
//       const savedMessage = await message.save();

//       return {
//         success: true,
//         data: this.formatMessage(savedMessage),
//       };
//     } catch (error) {
//       this.logger.error("Error creating message:", error);
//       return {
//         success: false,
//         error: "Failed to create message",
//       };
//     }
//   }

//   async getMessages(
//     conversationId: string,
//     limit: number,
//     before?: Date | string
//   ): Promise<ServiceResponse<any[]>> {
//     try {
//       if (!mongoose.Types.ObjectId.isValid(conversationId)) {
//         return {
//           success: false,
//           error: "Invalid conversation ID",
//         };
//       }

//       const query: any = {
//         conversationId: new mongoose.Types.ObjectId(conversationId),
//         deleted: false,
//       };

//       if (before) {
//         const beforeDate = new Date(before);
//         if (isNaN(beforeDate.getTime())) {
//           return {
//             success: false,
//             error: "Invalid cursor value",
//           };
//         }
//         query.createdAt = { $lt: beforeDate };
//       }

//       const messages = await MessageModel.find(query)
//         .sort({ createdAt: -1 })
//         .limit(limit + 1)
//         .populate("senderId", "username profilePicture")
//         .lean();

//       const hasMore = messages.length > limit;
//       const resultMessages = hasMore ? messages.slice(0, -1) : messages;

//       const nextCursor =
//         resultMessages.length > 0
//           ? resultMessages[resultMessages.length - 1].createdAt
//           : null;
//       return {
//         success: true,
//         data: resultMessages,
//       };
//     } catch (error) {
//       this.logger.error("Error fetching messages:", error);
//       return {
//         success: false,
//         error: "Failed to fetch messages",
//       };
//     }
//   }

//   async deleteMessage(messageId: string, userId: string) {
//     try {
//       const message = await MessageModel.findOne({
//         _id: new mongoose.Types.ObjectId(messageId),
//         senderId: new mongoose.Types.ObjectId(userId),
//       }).lean();

//       if (!message) {
//         return {
//           success: false,
//           error: "Message not found or unauthorized",
//         };
//       }

//       const existingMessage = await MessageModel.findById(messageId);

//       if (!existingMessage) {
//         return {
//           success: false,
//           error: "Message already deleted",
//         };
//       }

//       const deleteResult = await MessageModel.deleteOne({
//         _id: new mongoose.Types.ObjectId(messageId),
//         senderId: new mongoose.Types.ObjectId(userId),
//       });

//       if (deleteResult.deletedCount === 0) {
//         return {
//           success: false,
//           error: "Failed to delete message",
//         };
//       }
//       // await redisClient.del(`message:${messageId}`);

//       return {
//         success: true,
//         data: {
//           messageId,
//           conversationId: message.conversationId.toString(),
//           deletedAt: new Date(),
//         },
//       };
//     } catch (error) {
//       console.log(error);
//       this.logger.error("Error deleting message:", error);
//       return {
//         success: false,
//         error: "Failed to delete message",
//       };
//     }
//   }

//   async editMessage(
//     messageId: string,
//     userId: string,
//     content: string,
//     metadata?: Record<string, any>
//   ): Promise<ServiceResponse<any>> {
//     try {
//       if (!content?.trim() || content.length > 2000) {
//         return {
//           success: false,
//           error: "Message content must be between 1 and 2000 characters",
//         };
//       }

//       const message = await MessageModel.findOne({
//         _id: new mongoose.Types.ObjectId(messageId),
//         senderId: new mongoose.Types.ObjectId(userId),
//       });

//       if (!message) {
//         return { success: false, error: "Message not found or unauthorized" };
//       }

//       const editWindow = 15 * 60 * 1000;
//       if (Date.now() - message.createdAt.getTime() > editWindow) {
//         return {
//           success: false,
//           error: "Message cannot be edited after 15 minutes",
//         };
//       }

//       const updatePayload: any = {
//         content: content.trim(),
//         editedAt: new Date(),
//         edited: true,
//         $inc: { editCount: 1 },
//       };

//       if (metadata) {
//         updatePayload.metadata = { ...message.metadata, ...metadata };
//       }

//       const updatedMessage = await MessageModel.findByIdAndUpdate(
//         messageId,
//         updatePayload,
//         { new: true, runValidators: true }
//       );

//       if (!updatedMessage) {
//         return { success: false, error: "Failed to update message" };
//       }

//       await redisClient.set(
//         `message:${messageId}`,
//         JSON.stringify(this.formatMessage(updatedMessage)),
//         "EX",
//         86400
//       );

//       return {
//         success: true,
//         data: {
//           ...this.formatMessage(updatedMessage),
//           previousContent: message.content,
//           editCount: updatedMessage.get("editCount"),
//         },
//       };
//     } catch (error) {
//       this.logger.error("Error editing message:", error);
//       return { success: false, error: "Failed to edit message" };
//     }
//   }

//   async updateMessageStatus(messageId: string, status: MessageStatus) {
//     try {
//       const updatedMessage = await MessageModel.findByIdAndUpdate(
//         messageId,
//         {
//           $set: {
//             status: status,
//             updatedAt: new Date(),
//           },
//         },
//         { new: true }
//       );

//       if (!updatedMessage) {
//         return {
//           success: false,
//           error: "Message not found",
//         };
//       }

//       return {
//         success: true,
//         data: updatedMessage,
//       };
//     } catch (error) {
//       this.logger.error("Error updating message status:", error);
//       return {
//         success: false,
//         error: "Failed to update message status",
//       };
//     }
//   }

//   async markMessageAsRead(
//     messageId: string,
//     userId: string
//   ): Promise<ServiceResponse<any>> {
//     try {
//       const message = await MessageModel.findById(messageId);

//       if (!message) {
//         return {
//           success: false,
//           error: "Message not found",
//         };
//       }

//       const conversation = await MessageModel.findOne<any>({
//         _id: new mongoose.Types.ObjectId(message.conversationId),
//         "participants.userId": new mongoose.Types.ObjectId(userId),
//       });

//       if (!conversation) {
//         return {
//           success: false,
//           error: "Unauthorized",
//         };
//       }

//       if (message.senderId.toString() === userId) {
//         return {
//           success: true,
//           data: message,
//         };
//       }

//       const updatedMessage = await MessageModel.findByIdAndUpdate(
//         messageId,
//         {
//           $set: {
//             status: MessageStatus.READ,
//             readAt: new Date(),
//             "deliveryStatus.read": true,
//             "deliveryStatus.readAt": new Date(),
//           },
//         },
//         { new: true }
//       );

//       if (!updatedMessage) {
//         return {
//           success: false,
//           error: "Failed to update message status",
//         };
//       }
//       return { success: true, data: this.formatMessage(updatedMessage) };
//     } catch (error) {
//       this.logger.error("Error marking message as read:", error);
//       return {
//         success: false,
//         error: "Failed to mark message as read",
//       };
//     }
//   }

//   async updateMessage(
//     messageId: string,
//     userId: string,
//     content: string
//   ): Promise<ServiceResponse<any>> {
//     try {
//       if (!content || content.trim().length === 0) {
//         return { success: false, error: "Message content cannot be empty" };
//       }

//       const updatedMessage = await MessageModel.findOneAndUpdate(
//         {
//           _id: messageId,
//           sender: userId,
//           deletedAt: { $exists: false },
//         },
//         {
//           $set: {
//             content: content.trim(),
//             editedAt: new Date(),
//             "metadata.lastEditedBy": userId,
//           },
//         },
//         { new: true, runValidators: true }
//       ).populate("sender", "username avatar");

//       if (!updatedMessage) {
//         return {
//           success: false,
//           error: "Message not found or unauthorized to edit",
//         };
//       }

//       return { success: true, data: updatedMessage };
//     } catch (error) {
//       this.logger.error("Error updating message:", error);
//       return { success: false, error: "Failed to update message" };
//     }
//   }

//   // private async cacheMessage(message: any): Promise<void> {
//   //   const pipeline = redisClient.pipeline();
//   //   pipeline.hset(`message:${message.id}`, this.serializeMessage(message));
//   //   pipeline.zadd(
//   //     `message:${message.conversationId}`,
//   //     message.timestamp.getTime(),
//   //     message.id
//   //   );
//   //   pipeline.expire(`message:${message.id}`, 86400);
//   //   pipeline.expire(`message:${message.conversationId}`, 86400);
//   //   await pipeline.exec();
//   // }

//   // private async getCacheMessage(
//   //   conversationId: string,
//   //   limit: number
//   // ): Promise<Message[]> {
//   //   const messageIds = await redisClient.zrevrange(
//   //     `message:${conversationId}`,
//   //     0,
//   //     limit - 1
//   //   );
//   //   const message = await Promise.all(
//   //     messageIds.map(async (id) => {
//   //       const messageData = await redisClient.hgetall(`message:${id}`);
//   //       return this.deserializeMessage(messageData);
//   //     })
//   //   );

//   //   return message.filter(Boolean);
//   // }

//   // private serializeMessage(message: Message): Record<string, string> {
//   //   return {
//   //     id: message.id,
//   //     conversationId: message.conversationId,
//   //     senderId: message.senderId,
//   //     receiverId: message.receiverId,
//   //     content: message.content,
//   //     type: message.type,
//   //     status: message.status,
//   //     timestamp: message.timestamp ? message.timestamp.toISOString() : "",
//   //     metadata: message.metadata ? JSON.stringify(message.metadata) : "",
//   //   };
//   // }

//   //}

//   private formatMessage(message: any): Message {
//     return {
//       ...message,
//       _id: message._id,
//       receiverId: message.receiverId?.toString(),
//       conversationId: message.conversationId.toString(),
//     };
//   }
// }
