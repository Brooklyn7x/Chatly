import Redis from "ioredis";
import mongoose from "mongoose";
import { UserService } from "./userService";
import { Logger } from "../utils/logger";
import {
  Conversation,
  ConversationType,
  CreateConversationDTO,
  Participant,
  ParticipantRole,
} from "../types/conversation";
import { ServiceResponse } from "../types/service-respone";
import { ConversationModel } from "../models/conversation";

interface ParticipantUpdate {
  action: "add" | "remove" | "updateRole";
  userId: string;
  role?: ParticipantRole;
}

export class ConversationService {
  private redis: Redis;

  private userService: UserService;
  private logger: Logger;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL as string);

    this.userService = new UserService();
    this.logger = new Logger("ConversationService");
  }

  async createConversation(
    creatorId: string,
    data: CreateConversationDTO
  ): Promise<ServiceResponse<any>> {
    try {
      if (data.type === ConversationType.DIRECT) {
        const existing = await ConversationModel.findOne({
          type: ConversationType.DIRECT,
          "participants.userId": { $all: data.participantIds },
        }).lean();

        if (existing) {
          return {
            success: false,
            error: "Direct conversation already exists",
            data: existing,
          };
        }
      }

      const validParticipants = await this.validateParticipants(
        data.participantIds
      );

      if (!validParticipants.success) {
        return validParticipants;
      }

      if (data.type === ConversationType.DIRECT) {
        const existing = await this.findDirectConversation(
          creatorId,
          data.participantIds[0]
        );

        if (existing.success && existing.data) {
          return existing;
        }
      }

      // const allParticipantIds = data.participantIds.includes(creatorId)
      //   ? data.participantIds
      //   : [creatorId, ...data.participantIds];

      const allParticipantIds = this.getUniqueParticipants(
        creatorId,
        data.participantIds
      );

      const conversationData = {
        type: data.type,
        participants: this.createParticipantsList(creatorId, allParticipantIds),
        metadata: {
          ...data.metadata,
        },
        lastMessage: null,
        unreadCount: this.initializeUnreadCount(allParticipantIds),
      };

      const result = await ConversationModel.create(conversationData);

      if (result) {
        await this.cacheConversation(result);
        return {
          success: true,
          data: result,
        };
      }
      return {
        success: false,
        error: "Failed to create conversation",
      };
    } catch (error) {
      this.logger.error("Error creating conversation:", error);
      return {
        success: false,
        error: "Failed to create conversation",
      };
    }
  }

  async deleteConversation(
    conversationId: string,
    userId: string
  ): Promise<ServiceResponse<any>> {
    try {
      const conversation = await ConversationModel.findOne({
        _id: conversationId,
        "participants.userId": userId,
        "participants.role": ParticipantRole.OWNER,
      });

      if (!conversation) {
        return {
          success: false,
          error: "Conversation not found or unauthorized",
        };
      }

      //delete file and message here
      // await Promise.all([
      // ])

      const result = await ConversationModel.deleteOne({ _id: conversationId });

      if (result) {
        const cacheKey = `conversation:${conversationId}`;
        await this.redis.del(cacheKey);

        return {
          success: true,
          data: {
            id: conversationId,
            deletedAt: new Date(),
          },
        };
      }
      return {
        success: false,
        error: "Failed to delete conversation",
      };
    } catch (error) {
      this.logger.error("Error deleting conversation:", error);
      return {
        success: false,
        error: "Failed to delete conversation",
      };
    }
  }

  async getConversationById(
    conversationId: string
  ): Promise<ServiceResponse<any>> {
    try {
      const conversation = await ConversationModel.findOne({
        _id: conversationId,
      });

      if (!conversation) {
        return {
          success: false,
          error: "Conversation not found or unauthorized",
        };
      }

      await this.cacheConversation(conversation);
      return { success: true, data: conversation };
    } catch (error) {
      this.logger.error("Error fetching conversation:", error);
      return { success: false, error: "Failed to fetch conversation" };
    }
  }

  async getAllConversations(
    conversationId: string,
    userId: string
  ): Promise<ServiceResponse<any>> {
    try {
      const cacheConversation = await this.getCacheConversation(conversationId);

      if (cacheConversation) {
        return {
          success: true,
          data: cacheConversation,
        };
      }

      const conversations = await ConversationModel.findOne({
        _id: conversationId,
        participants: userId,
      }).sort({ createdAt: -1 });

      if (!conversations) {
        return {
          success: false,
          error: "Conversation not found",
        };
      }

      await this.cacheConversation(conversations);

      return {
        success: true,
        data: conversations,
      };
    } catch (error) {
      this.logger.error("Error fetching conversation:", error);
      return {
        success: false,
        error: "Failed to fetch conversation",
      };
    }
  }

  // async getUserConversation(
  //   conversationId: string,
  //   userId: string
  // ): Promise<ServiceResponse<any>> {
  //   try {
  //     const cacheConversation = await this.getCacheConversation(conversationId);

  //     if (cacheConversation) {
  //       return {
  //         success: true,
  //         data: cacheConversation,
  //       };
  //     }

  //     const conversations = await ConversationModel.findOne({
  //       _id: conversationId,
  //       "participants.userId": userId,
  //     }).populate({
  //       path: "participants.data",
  //       model: "User",
  //       select: "username email",
  //     });

  //     if (!conversations) {
  //       return {
  //         success: false,
  //         error: "Conversation not found",
  //       };
  //     }

  //     await this.cacheConversation(conversations);

  //     return {
  //       success: true,
  //       data: conversations,
  //     };
  //   } catch (error) {
  //     this.logger.error("Error fetching conversation:", error);
  //     return {
  //       success: false,
  //       error: "Failed to fetch conversation",
  //     };
  //   }
  // }

  // async deleteConversation(
  //   conversationId: string,
  //   userId: string
  // ): Promise<ServiceResponse<any>> {
  //   try {
  //     console.log(conversationId, "conversationId");
  //     const conversation = await this.db.findOne("Conversation", {
  //       id: conversationId,
  //     });

  //     if (!conversation) {
  //       return {
  //         success: false,
  //         error: "Conversation not found",
  //       };
  //     }

  //     const result = await ConversationModel.deleteOne({
  //       id: conversationId,
  //     });

  //     if (result) {
  //       const cacheKey = `conversation:${conversationId}`;
  //       await this.redis.del(cacheKey);

  //       return {
  //         success: true,
  //         data: result,
  //       };
  //     }
  //     return {
  //       success: false,
  //       error: "Failed to delete conversation",
  //     };
  //   } catch (error) {
  //     this.logger.error("Error deleting conversation:", error);
  //     return {
  //       success: false,
  //       error: "Failed to delete conversation",
  //     };
  //   }
  // }

  async getUserConversations(
    userId: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<ServiceResponse<any[]>> {
    try {
      const conversations = await ConversationModel.find({
        "participants.userId": userId,
      })
        .populate({
          path: "participants.userId",
          model: "User",
          select: "username email",
        })
        .sort({ updatedAt: -1 })
        .skip(offset)
        .limit(limit);

      if (!conversations.length) {
        return {
          success: false,
          error: "No conversations found",
        };
      }

      await Promise.all(
        conversations.map((con) => this.cacheConversation(con))
      );

      return {
        success: true,
        data: conversations,
      };
    } catch (error) {
      this.logger.error("Error fetching conversations:", error);
      return {
        success: false,
        error: "Error fetching user conversations",
      };
    }
  }

  async getConversationsByUser(userId: string) {
    try {
      const conversations = await ConversationModel.find({
        "participants.userId": userId,
      });
      return {
        success: true,
        data: conversations,
      };
    } catch (error) {
      this.logger.error("Error to fetch conversations :", error);
      return {
        success: false,
        error: "Error to fetch user conversations",
      };
    }
  }

  private async findDirectConversation(
    creatorId: string,
    otherParticipantId: string
  ): Promise<ServiceResponse<any | null>> {
    try {
      const existingConversation = await ConversationModel.findOne({
        type: ConversationType.DIRECT,
        participants: {
          $all: [
            { $elemMatch: { userId: creatorId } },
            { $elemMatch: { userId: otherParticipantId } },
          ],
        },
      });

      if (existingConversation) {
        return {
          success: true,
          data: existingConversation,
        };
      }

      return {
        success: true,
        data: null,
      };
    } catch (error) {
      this.logger.error("Error finding direct conversation:", error);
      return {
        success: false,
        error: "Failed to find direct conversation",
      };
    }
  }

  private createParticipantsList(
    creatorId: string,
    participantIds: string[]
  ): Participant[] {
    return participantIds.map((userId) => ({
      userId: new mongoose.Types.ObjectId(userId).toString(),
      role:
        userId === creatorId ? ParticipantRole.OWNER : ParticipantRole.MEMBER,
      joinedAt: new Date(),
    }));
  }

  private async cacheConversation(conversation: any): Promise<void> {
    const pipeline = this.redis.pipeline();
    const cacheKey = `conversations:${conversation.id}`;

    pipeline.hset(cacheKey, {
      id: conversation.id,
      type: conversation.type,
      updatedAt: conversation.updatedAt.toISOString(),
      metadata: JSON.stringify(conversation.metadata || {}),
    });

    conversation.participants.forEach((participant: any) => {
      pipeline.hset(`${cacheKey}:participant:${participant.userId}`, {
        role: participant.role,
        joinedAt: participant.joinedAt.toISOString(),
        lastReadAt: participant.lastReadAt?.toISOString() || "",
      });
    });

    pipeline.expire(cacheKey, 3600);
    await pipeline.exec();
  }

  private async getCacheConversation(
    conversationId: string
  ): Promise<Conversation | null> {
    const cacheKey = `conversation:${conversationId}`;
    const conversationData = await this.redis.hgetall(cacheKey);

    if (!Object.keys(conversationData).length) {
      return null;
    }
    const participantKey = await this.redis.keys(`${cacheKey}:participant:*`);

    const participants = await Promise.all(
      participantKey.map(async (key) => {
        const userId = key.split(":").pop()!;
        const data = await this.redis.hgetall(key);
        return {
          userId,
          role: data.role as ParticipantRole,
          joinedAt: new Date(data.joinedAt),
          lastReadAt: data.lastReadAt ? new Date(data.lastReadAt) : undefined,
        };
      })
    );

    return {
      // _id: conversationData.id,
      type: conversationData.type as ConversationType,
      participants,
      metadata: JSON.parse(conversationData.metadata || "{}"),
      unreadCount: {},
      createdAt: new Date(conversationData.createdAt),
      updatedAt: new Date(conversationData.updatedAt),
    };
  }

  private async validateParticipants(
    participantIds: string[]
  ): Promise<ServiceResponse<void>> {
    try {
      const users = await Promise.all(
        participantIds.map((id) => this.userService.getUserById(id))
      );

      const invalidUsers = users.filter((result) => !result.success);
      if (invalidUsers.length > 0) {
        return {
          success: false,
          error: "One or more invalid participants",
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: "Failed to validate participants",
      };
    }
  }

  private getUniqueParticipants(
    creatorId: string,
    participantIds: string[]
  ): string[] {
    return [...new Set([creatorId, ...participantIds])];
  }

  private initializeUnreadCount(
    participantIds: string[]
  ): Record<string, number> {
    return participantIds.reduce(
      (acc, id) => ({
        ...acc,
        [id]: 0,
      }),
      {}
    );
  }

  async updateConversation(
    conversationId: string,
    userId: string,
    updateData: {
      metadata?: {
        title?: string;
        description?: string;
        avatar?: string;
        isArchived?: boolean;
        isPinned?: boolean;
      };
      participants?: ParticipantUpdate[];
    }
  ): Promise<ServiceResponse<any>> {
    try {
      // 1. Verify conversation exists and user has permission
      const conversation = await ConversationModel.findOne({
        _id: conversationId,
        "participants.userId": userId,
        "participants.role": {
          $in: [ParticipantRole.OWNER, ParticipantRole.ADMIN],
        },
      });

      if (!conversation) {
        return {
          success: false,
          error: "Conversation not found or insufficient permissions",
        };
      }

      // 2. Prepare update operations
      const updateOperations: Record<string, any> = {
        $set: { updatedAt: new Date() },
        $inc: { __v: 1 },
      };

      // 3. Handle metadata updates
      if (updateData.metadata) {
        if (conversation.type === ConversationType.DIRECT) {
          if (updateData.metadata.title || updateData.metadata.avatar) {
            return {
              success: false,
              error:
                "Direct conversations cannot have custom titles or avatars",
            };
          }
        } else {
          if (updateData.metadata.title) {
            updateOperations.$set["metadata.title"] = updateData.metadata.title;
          }
          if (updateData.metadata.avatar) {
            updateOperations.$set["metadata.avatar"] =
              updateData.metadata.avatar;
          }
        }

        if (typeof updateData.metadata.isArchived === "boolean") {
          updateOperations.$set["metadata.isArchived"] =
            updateData.metadata.isArchived;
        }
        if (typeof updateData.metadata.isPinned === "boolean") {
          updateOperations.$set["metadata.isPinned"] =
            updateData.metadata.isPinned;
        }
      }

      // 4. Handle participant updates
      if (updateData.participants) {
        for (const update of updateData.participants) {
          switch (update.action) {
            case "add":
              const exists = conversation.participants.some(
                (p) => p.userId.toString() === update.userId
              );
              if (!exists) {
                updateOperations.$addToSet = {
                  participants: {
                    userId: new mongoose.Types.ObjectId(update.userId),
                    role: update.role || ParticipantRole.MEMBER,
                    joinedAt: new Date(),
                  },
                };
              }
              break;

            case "remove":
              updateOperations.$pull = {
                participants: {
                  userId: new mongoose.Types.ObjectId(update.userId),
                },
              };
              break;

            case "updateRole":
              updateOperations.$set = updateOperations.$set || {};
              updateOperations.$set["participants.$[elem].role"] = update.role;
              break;
          }
        }
      }

      // 5. Perform update
      const options = {
        new: true,
        arrayFilters: updateData.participants?.some(
          (u) => u.action === "updateRole"
        )
          ? [
              {
                "elem.userId": {
                  $in: updateData.participants.map((u) => u.userId),
                },
              },
            ]
          : undefined,
      };

      const updatedConversation = await ConversationModel.findByIdAndUpdate(
        conversationId,
        updateOperations,
        options
      );

      if (!updatedConversation) {
        return {
          success: false,
          error: "Failed to update conversation",
        };
      }

      // 6. Update cache
      await this.cacheConversation(updatedConversation);

      return {
        success: true,
        data: updatedConversation,
      };
    } catch (error) {
      this.logger.error("Error updating conversation:", error);
      return {
        success: false,
        error: "Failed to update conversation",
      };
    }
  }

  async markAsRead(
    conversationId: string,
    userId: string
  ): Promise<ServiceResponse<any>> {
    try {
      const conversation = await ConversationModel.findOneAndUpdate(
        {
          _id: conversationId,
          "participants.userId": userId,
        },
        {
          $set: {
            "participants.$[elem].lastReadAt": new Date(),
            "unreadCount.$[elem].count": 0,
          },
        },
        {
          arrayFilters: [{ "elem.userId": userId }],
          new: true,
        }
      );

      if (!conversation) {
        return {
          success: false,
          error: "Conversation not found",
        };
      }

      await this.cacheConversation(conversation);
      return { success: true, data: conversation };
    } catch (error) {
      this.logger.error("Error marking conversation as read:", error);
      return { success: false, error: "Failed to mark conversation as read" };
    }
  }
}
