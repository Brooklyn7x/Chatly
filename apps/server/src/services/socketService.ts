import { Socket } from "socket.io";
import { io } from "../utils/socket";
import { AuthService } from "./authService";
import { UserService } from "./userService";
import { MessageService } from "./messageService";
import { UserStatus } from "../types/user.types";
import { BaseService } from "./baseService";
import { ConversationService } from "./conversationService";
import { AttachmentType, MessageStatus, MessageType } from "../types/message";
import { GroupService } from "./groupService";

export class SocketService extends BaseService {
  private static instance: SocketService;
  private authService: AuthService;
  private messageService: MessageService;
  private userService: UserService;
  private conversationService: ConversationService;
  private groupService: GroupService;
  private onlineUsers: Map<string, string>;
  private typingUsers: Map<string, Set<string>>;

  constructor() {
    super("SocketService");
    this.messageService = new MessageService();
    this.authService = new AuthService();
    this.userService = new UserService();
    this.conversationService = new ConversationService();
    this.onlineUsers = new Map();
    this.typingUsers = new Map();
    this.groupService = new GroupService();
    this.setUpSocketHandler();
    BaseService.setSocketService(this);
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  private setUpSocketHandler() {
    io.use(this.authenticateSocket.bind(this));
    io.on("connection", this.handleConnection.bind(this));
  }

  private async authenticateSocket(
    socket: Socket,
    next: (err?: Error) => void
  ) {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("No authentication token"));
      }

      const validation = await this.authService.validateToken(token);
      if (!validation.success) {
        return next(new Error("Invalid authentication token"));
      }

      socket.data.userId = validation.data!.userId;
      next();
    } catch (error) {
      this.logger.error("Authentication error", error);
      next(new Error("Authentication failed"));
    }
  }

  private async handleConnection(socket: Socket) {
    try {
      await this.setupUserConnection(socket);
      this.setupConnection(socket);
      this.setupMessageHandlers(socket);
      this.setupChatHandlers(socket);
      this.setupGroupHandlers(socket);
      this.setupNotificationHandlers(socket);
      this.setupTypingHandlers(socket);
    } catch (error) {
      socket.disconnect(true);
    }
  }

  private async setupUserConnection(socket: Socket) {
    const { userId } = socket.data;
    this.onlineUsers.set(userId, socket.id);
    socket.join(`user:${userId}`);
    await this.userService.updateUserStatus(userId, UserStatus.ONLINE);
    this.broadcastUserStatus(userId, UserStatus.ONLINE);
  }

  private async setupConnection(socket: Socket) {
    socket.on("disconnect", () => this.handleDisconnect(socket));
    socket.on("reconnect", async () => {
      try {
        await this.setupUserConnection(socket);
        await this.userService.updateUserStatus(
          socket.data.userId,
          UserStatus.ONLINE
        );
      } catch (error) {
        this.handleError(socket, "reconnect:error", error);
      }
    });
  }

  private setupChatHandlers(socket: Socket) {
    const { userId } = socket.data;

    socket.on("chat:join", async (data) => {
      try {
        await socket.join(`chat:${data.chatId}`);
        this.logger.info(`chat:${data.chatId} joined room`);
        socket.to(`chat:${data.chatId}`).emit("chat:joined", {
          userId,
          chatId: data.chatId,
        });
      } catch (error) {
        this.handleError(socket, "chat:error", error);
      }
    });

    socket.on("chat:leave", async (data) => {
      try {
        await socket.leave(`chat:${data.chatId}`);
        socket.to(`chat:${data.chatId}`).emit("chat:left", {
          userId,
          chatId: data.chatId,
        });
      } catch (error) {
        this.handleError(socket, "chat:error", error);
      }
    });

    socket.on("chat:update", async (data) => {
      try {
        // const result = this.conversationService.updateConversation(data)
        // if (result.success) {
        //   io.to(`chat:${data.conversationId}`).emit("chat:updated", result.data);
        // }
      } catch (error) {
        this.handleError(socket, "chat:error", error);
      }
    });
  }

  private setupGroupHandlers(socket: Socket): void {
    const { userId } = socket.data;

    socket.on("group:join", async (data: { groupId: string }) => {
      console.log(data.groupId, "socket.data");
      try {
        await socket.join(`group:${data.groupId}`);
        this.logger.info(`group:${data.groupId} joint the group`);
        socket.to(`group:${data.groupId}`).emit("group:joined", {
          userId: userId,
          groupId: data.groupId,
        });
      } catch (error) {
        this.handleError(socket, "group:error", error);
      }
    });
    socket.on("group:leave", async (data) => {
      try {
        await socket.leave(`group:${data.groupId}`);
        socket.to(`group:${data.groupId}`).emit("group:left", {
          userId: data.userId,
          groupId: data.groupId,
        });
      } catch (error) {
        this.handleError(socket, "group:error", error);
      }
    });

    socket.on(
      "group:create",
      async (data: {
        name: string;
        participantIds: string[];
        metadata?: any;
      }) => {
        try {
          const { name, participantIds, metadata } = data;

          const result = await this.groupService.createGroup(
            userId,
            name,
            participantIds,
            metadata
          );

          if (result.success) {
            result.data.participants.forEach((p: any) => {
              const participantSocket = this.onlineUsers.get(p.userId);
              if (participantSocket) {
                io.sockets.sockets
                  .get(participantSocket)
                  ?.join(`group:${result.data._id}`);
              }
            });

            io.to(`group:${result.data._id}`).emit("group:created", {
              ...result.data,
              createdBy: userId,
              participants: result.data.participants.map((p: any) => ({
                userId: p.userId,
                role: p.role,
              })),
            });
          } else {
            socket.emit("group:error", {
              type: "create_error",
              message: result.error,
            });
          }
        } catch (error) {
          this.handleError(socket, "group:error", error);
        }
      }
    );

    socket.on(
      "group:update_settings",
      async (data: {
        groupId: string;
        updates: {
          title?: string;
          description?: string;
          avatar?: string;
        };
      }) => {
        try {
          const result = await this.groupService.updateGroupSettings(
            data.groupId,
            data.updates,
            userId
          );

          if (result.success) {
            io.to(`group:${data.groupId}`).emit("group:updated", {
              groupId: data.groupId,
              updates: result.data,
              updatedBy: userId,
            });
          } else {
            socket.emit("group:error", {
              type: "update_error",
              groupId: data.groupId,
              message: result.error,
            });
          }
        } catch (error) {
          this.handleError(socket, "group:error", error);
        }
      }
    );

    socket.on(
      "group:add_member",
      async (data: { groupId: string; userId: string }) => {
        try {
          const result = await this.groupService.addMemberToGroup(
            data.groupId,
            data.userId,
            userId
          );

          if (result.success) {
            const newMemberSocket = this.onlineUsers.get(data.userId);
            if (newMemberSocket) {
              await io.sockets.sockets
                .get(newMemberSocket)
                ?.join(`group:${data.groupId}`);
            }

            io.to(`group:${data.groupId}`).emit("group:member_added", {
              groupId: data.groupId,
              userId: data.userId,
              addedBy: userId,
            });
          } else {
            socket.emit("group:error", {
              type: "add_member_error",
              groupId: data.groupId,
              message: result.error,
            });
          }
        } catch (error) {
          this.handleError(socket, "group:error", error);
        }
      }
    );

    socket.on(
      "group:remove_member",
      async (data: { groupId: string; userId: string }) => {
        try {
          const result = await this.groupService.removeMemberFromGroup(
            data.groupId,
            data.userId,
            userId
          );

          if (result.success) {
            const removedMemberSocket = this.onlineUsers.get(data.userId);
            if (removedMemberSocket) {
              await io.sockets.sockets
                .get(removedMemberSocket)
                ?.leave(`group:${data.groupId}`);
            }

            io.to(`group:${data.groupId}`).emit("group:member_removed", {
              groupId: data.groupId,
              userId: data.userId,
              removedBy: userId,
            });
          } else {
            socket.emit("group:error", {
              type: "remove_member_error",
              groupId: data.groupId,
              message: result.error,
            });
          }
        } catch (error) {
          this.handleError(socket, "group:error", error);
        }
      }
    );

    socket.on("group:delete", async (groupId: string) => {
      try {
        const result = await this.groupService.deleteGroup(groupId, userId);

        if (result.success) {
          io.to(`group:${groupId}`).emit("group:deleted", {
            groupId,
            deletedBy: userId,
          });
          io.in(`group:${groupId}`).socketsLeave(`group:${groupId}`);
        } else {
          socket.emit("group:error", {
            type: "delete_error",
            groupId,
            message: result.error,
          });
        }
      } catch (error) {
        this.handleError(socket, "group:error", error);
      }
    });

    socket.on(
      "group:promote_member",
      async (data: { groupId: string; userId: string }) => {
        try {
          const result = await this.groupService.promoteMember(
            data.groupId,
            data.userId,
            userId
          );

          if (result.success) {
            io.to(`group:${data.groupId}`).emit("group:member_promoted", {
              groupId: data.groupId,
              userId: data.userId,
              newRole: result.data.newRole,
              promotedBy: userId,
            });
          } else {
            socket.emit("group:error", {
              type: "promotion_error",
              groupId: data.groupId,
              message: result.error,
            });
          }
        } catch (error) {
          this.handleError(socket, "group:error", error);
        }
      }
    );

    socket.on(
      "group:invite",
      async (data: { groupId: string; userId: string; message?: string }) => {
        try {
          const groupResult =
            await this.conversationService.getConversationById(data.groupId);
          if (!groupResult.success) {
            throw new Error("Group not found");
          }

          const userResult = await this.userService.getUserById(data.userId);
          if (!userResult.success) {
            throw new Error("User not found");
          }

          this.sendToUser(data.userId, "group:invite_received", {
            groupId: data.groupId,
            groupName: groupResult.data.metadata.title,
            invitedBy: userId,
            message: data.message,
          });

          socket.emit("group:invite_sent", {
            groupId: data.groupId,
            userId: data.userId,
          });
        } catch (error) {
          this.handleError(socket, "group:error", error);
        }
      }
    );
  }

  private setupMessageHandlers(socket: Socket): void {
    const { userId } = socket.data;
    socket.on("message:send", async (data) => {
      try {
        const result = await this.messageService.sendMessage(
          socket.data.userId,
          data
        );

        if (result.success) {
          socket.emit("message:sent", {
            tempId: data.tempId,
            messageId: result.data._id,
            status: "sent",
            timestamp: new Date(),
          });
        }

        await this.deliverMessage(result.data);
      } catch (error) {
        this.handleError(socket, "message:error", error);
      }
    });

    socket.on(
      "message:read",
      async (data: { messageIds: string[]; conversationId: string }) => {
        try {
          const { userId } = socket.data;
          const timestamp = new Date().toISOString();

          const updatePromises = data.messageIds.map(async (messageId) => {
            const result = await this.messageService.markMessageAsRead(
              messageId,
              userId
            );
            return result;
          });

          await Promise.all(updatePromises);

          socket
            .to(`conversation:${data.conversationId}`)
            .emit("message:read:ack", {
              messageIds: data.messageIds,
              conversationId: data.conversationId,
              readBy: userId,
              timestamp,
            });
        } catch (error) {
          this.handleError(socket, "message:error", error);
        }
      }
    );

    socket.on(
      "message:edit",
      async (data: { messageId: string; content: string }) => {
        try {
          const result = await this.messageService.editMessage(
            data.messageId,
            userId,
            data.content
          );

          if (result.success) {
            io.to(`conversation:${result.data.conversationId}`).emit(
              "message:edited",
              {
                ...result.data,
                editedBy: userId,
                editedAt: new Date(),
              }
            );
          } else {
            socket.emit("message:error", { error: result.error });
          }
        } catch (error) {
          this.handleError(socket, "message:error", error);
        }
      }
    );

    socket.on("message:delete", async (data: { messageId: string }) => {
      try {
        const result = await this.messageService.deleteMessage(
          data.messageId,
          userId
        );
        if (result.success) {
          io.to(`conversation:${result.data?.conversationId}`).emit(
            "message:deleted",
            {
              messageId: data.messageId,
              deletedAt: new Date(),
            }
          );
        }
      } catch (error) {
        this.handleError(socket, "message:error", error);
      }
    });
  }

  private setupNotificationHandlers(socket: Socket) {
    socket.on("notification:read", async () => {
      try {
        //mark as read
      } catch (error) {}
    });
  }

  private setupTypingHandlers(socket: Socket): void {
    socket.on("typing:start", async (data: { conversationId: string }) => {
      const { userId } = socket.data;
      const { conversationId } = data;

      if (!this.typingUsers.has(conversationId)) {
        this.typingUsers.set(conversationId, new Set());
      }

      this.typingUsers.get(conversationId)?.add(userId);
      socket.to(`chat:${conversationId}`).emit("typing:update", {
        conversationId,
        userIds: Array.from(this.typingUsers.get(conversationId) || []),
      });
    });

    socket.on("typing:stop", async (data: { conversationId: string }) => {
      const { userId } = socket.data;
      const { conversationId } = data;

      this.typingUsers.get(conversationId)?.delete(userId);
      socket.to(conversationId).emit("typing:update", {
        conversationId,
        userIds: Array.from(this.typingUsers.get(conversationId) || []),
      });
    });

    socket.on("disconnect", () => {
      this.typingUsers.forEach((users, conversationId) => {
        if (users.has(socket.data.userId)) {
          users.delete(socket.data.userId);
          socket.to(conversationId).emit("typing:update", {
            conversationId,
            userIds: Array.from(users),
          });
        }
      });
    });
  }

  private async deliverMessage(message: any): Promise<void> {
    const conversation = await this.conversationService.getConversationById(
      message.conversationId
    );

    if (!conversation.success) return;

    const messageData = {
      ...message,
      status: MessageStatus.DELIVERED,
      timestamp: new Date(),
    };

    if (conversation.data.type === "direct") {
      const receiverId = conversation.data.participants.find(
        (p: any) => p.userId.toString() !== message.senderId
      )?.userId;

      if (receiverId) {
        io.to(`user:${receiverId}`).emit("message:new", messageData);
      }
    } else {
      io.to(`group:${message.conversationId}`).emit("message:new", messageData);
    }
  }

  private async handleGroupMessage(socket: Socket, data: any, result: any) {
    console.log("Group message handling", data, result);
    try {
      const conversation = await this.conversationService.getConversationById(
        data.conversationId
      );
      if (!conversation.success) {
        socket.emit("message:error", {
          error: conversation.error,
          messageId: data.messageId,
        });
        return;
      }

      io.to(`group:${data.conversationId}`).emit("message:new", {
        ...result.data,
        type: "group",
        conversationType: "group",
        conversationId: data.conversationId,
        sender: {
          userId: result.data.userId,
          time: new Date(),
        },
      });
    } catch (error) {
      this.logger.error("Group message handling error", error);
      socket.emit("message:error", {
        error: "Failed to send message",
        messageId: data.messageId,
      });
    }
  }

  private async handleDirectMessage(socket: Socket, data: any, result: any) {
    io.to(`user:${data.receiverId}`).emit("message:new", {
      data,
    });
  }

  private async handleDisconnect(socket: Socket) {
    const { userId } = socket.data;
    this.onlineUsers.delete(userId);
    await this.userService.updateUserStatus(userId, UserStatus.OFFLINE);
    this.broadcastUserStatus(userId, UserStatus.OFFLINE);
  }

  public async sendToUser(
    userId: string,
    event: string,
    data: any
  ): Promise<void> {
    io.to(`user:${userId}`).emit(event, data);
  }

  public async broadcast(event: string, data: any): Promise<void> {
    io.emit(event, data);
  }

  private broadcastUserStatus(userId: string, status: UserStatus): void {
    io.emit("user:status_change", {
      userId,
      status,
      timestamp: new Date(),
    });
  }

  private handleError(socket: Socket, event: string, error: any): void {
    this.logger.error(`${event} error:`, error);
    socket.emit(`${event}:error`, {
      message: error.message || "Operation failed",
    });
  }
}
