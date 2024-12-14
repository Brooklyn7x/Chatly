import Redis from "ioredis";
import { DatabaseService } from "./database.service";
import { MessageService } from "./message.service";
import { UserService } from "./user.service";
import Logger from "../utils/logger";
import { config } from "../config/config";
import {
  Conversation,
  ConversationType,
  CreateConversationDTO,
  Participant,
  ParticipantRole,
} from "../types/conversation";
import { ServiceResponse } from "../types/common/service-respone";

export class ConversationService {
  private redis: Redis;
  private db: DatabaseService;
  private messageService: MessageService;
  private userService: UserService;
  private logger: Logger;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL as string);
    this.db = new DatabaseService();
    this.messageService = new MessageService();
    this.userService = new UserService();
    this.logger = new Logger("ConversationService");
  }

  async createConversation(
    creatorId: string,
    data: CreateConversationDTO
  ): Promise<ServiceResponse<any>> {
    try {
      const validParticipants = await this.validateParticipants(
        data.participantIds
      );

      if (!validParticipants.success) {
        return validParticipants;
      }

      if (data.type === ConversationType.DIRECT) {
        const existingConversation = await this.findDirectConversation(
          creatorId,
          data.participantIds[0]
        );

        if (existingConversation.success && existingConversation.data) {
          return existingConversation;
        }
      }

      const conversation: Conversation = {
        id: crypto.randomUUID(),
        type: data.type,
        participants: this.createParticipantsList(
          creatorId,
          data.participantIds
        ),
        unreadCount: {},
        metadata: data.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const storedConversation = await this.db.create(
        "conversation",
        conversation
      );

      await this.cacheConversation(storedConversation);

      // await this.notifyParticipants(storedConversation)

      return {
        success: true,
        data: storedConversation,
      };
    } catch (error) {
      this.logger.error("Error creating conversation:", error);
      return {
        success: false,
        error: "Failed to create conversation",
      };
    }
  }

  async getConversation(
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

      const conversation = await this.db.findOne("conversations", {
        id: conversationId,
        "participants.userId": userId,
      });

      if (!conversation) {
        return {
          success: false,
          error: "Conversation not found",
        };
      }

      await this.cacheConversation(conversation);

      return {
        success: true,
        data: conversation,
      };
    } catch (error) {
      this.logger.error("Error fetching conversation:", error);
      return {
        success: false,
        error: "Failed to fetch conversation",
      };
    }
  }

  async getUserConversations(
    userId: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<ServiceResponse<any[]>> {
    try {
      const conversations = await this.db.find(
        "conversation",
        {
          "participant.userId": userId,
        },
        { sort: { updatedAt: -1 }, skip: offset, limit }
      );

      await Promise.all(
        conversations.map((con) => this.cacheConversation(con))
      );

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
  // async markConversationAsRead(
  //   conversationId: string,
  //   userId: string
  // ): Promise<ServiceResponse<void>> {
  //   try {
  //     const pipeline = this.redis.pipeline();
  //     const now = new Date();

  //     await this.db.findOneAndUpdate(
  //       "conversations",
  //       {
  //         id: conversationId,
  //         "participant.userId": userId,
  //       },
  //       {
  //         $set: {
  //           "participants.$.lastReadAt": now,
  //           "unreadCount.$": 0,
  //         },
  //       }
  //     );

  //     pipeline.hset(
  //       `conversation:${conversationId}:participant:${userId}`,
  //       "lastReadAt",
  //       now.toISOString()
  //     );

  //     pipeline.hset(
  //       `conversation:${conversationId}`,
  //       `unreadCount:${userId}`,
  //       "0"
  //     );

  //     await pipeline.exec();
  //     return { success: true };
  //   } catch (error) {
  //     this.logger.error("Error marking conversation as read:", error);
  //     return {
  //       success: false,
  //       error: "Failed to mark conversation as read",
  //     };
  //   }
  // }

  private async findDirectConversation(
    creatorId: string,
    otherParticipantId: string
  ): Promise<ServiceResponse<any | null>> {
    try {
      // Find a direct conversation where both participants exist
      const existingConversation = await this.db.findOne("conversations", {
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
    const now = new Date();
    const participants = participantIds.map((userId) => ({
      userId,
      role:
        userId === creatorId ? ParticipantRole.OWNER : ParticipantRole.MEMBER,
      joinedAt: now,
    }));
    return participants;
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
      id: conversationData.id,
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
}
