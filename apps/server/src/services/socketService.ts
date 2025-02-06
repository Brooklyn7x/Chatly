import { Socket } from "socket.io";
import { io } from "../utils/socket";
import { AuthService } from "./authService";
import { UserService } from "./userService";
import { MessageService } from "./messageService";
import { UserStatus } from "../types/user.types";
import { BaseService } from "./baseService";
import { ConversationService } from "./conversationService";
import { AttachmentType, MessageStatus, MessageType } from "../types/message";
import { FileService } from "./fileService";
import { GroupService } from "./groupService";
import {
  ConversationType,
  CreateChatDTO,
  ParticipantRole,
} from "../types/conversation";

export class SocketService extends BaseService {
  private static instance: SocketService;
  private authService: AuthService;
  private messageService: MessageService;
  private userService: UserService;
  private conversationService: ConversationService;
  private fileService: FileService;
  private groupService: GroupService;
  private onlineUsers: Map<string, string>;

  constructor() {
    super("SocketService");
    this.messageService = new MessageService();
    this.authService = new AuthService();
    this.userService = new UserService();
    this.conversationService = new ConversationService();
    this.fileService = new FileService();
    this.onlineUsers = new Map();
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
      this.setupUserStatusHandlers(socket);
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
    socket.join(`user:${userId}`);
    this.logger.info(`user join ${userId}`);
    this.onlineUsers.set(userId, socket.id);
    await this.userService.updateUserStatus(userId, UserStatus.ONLINE);
    const conversations =
      await this.conversationService.getConversationsByUser(userId);
    for (const conv of conversations.data || []) {
      socket.join(`conversation:${conv._id}`);
    }
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

  private setupUserStatusHandlers(socket: Socket) {
    socket.on("user:status_change", async (data) => {});
    socket.on("user:away", async () => {});
  }

  private setupChatHandlers(socket: Socket) {
    const { userId } = socket.data;
    socket.on("chat:create", async (data: CreateChatDTO) => {
      try {
        if (!data.participantIds?.length) {
          throw new Error("Participants are required");
        }

        const createDirectChat = {
          type: ConversationType.DIRECT,
          participantIds: data.participantIds,
          metadata: {
            title: data.metadata?.title,
            description: data.metadata?.description,
            avatar: data.metadata?.avatar,
            isArchived: false,
            isPinned: false,
          },
        };

        const result = await this.conversationService.createConversation(
          userId,
          createDirectChat
        );

        if (!result.success) {
          throw new Error(result.error);
        }

        await socket.join(`chat:${result.data.id}`);

        console.log(result, "result");

        socket.emit("chat:created", {
          tempId: data.tempId,
          conversationId: result.data._id,
          type: result.data.type,
          participants: result.data.participants,
          metadata: result.data.metadata,
          createdAt: result.data.createdAt,
        });

        const otherParticipant = result.data.participants.find(
          (p: any) => p.userId.toString() !== userId
        );

        if (otherParticipant) {
          this.sendToUser(otherParticipant.userId, "chat:new", {
            conversationId: result.data._id,
            type: result.data.type,
            participants: result.data.participants,
            metadata: result.data.metadata,
            createdAt: result.data.createdAt,
            createdBy: userId,
          });
        }
      } catch (error) {
        this.handleError(socket, "chat:error", error);
      }
    });

    socket.on("chat:delete", async (chatId: string) => {
      try {
        const conversation =
          await this.conversationService.getConversationById(chatId);

        if (!conversation.success) {
          throw new Error("Conversation not found");
        }

        const userParticipant = conversation.data.participants.find(
          (p: any) => p.userId.toString() === userId
        );

        if (
          !userParticipant ||
          userParticipant.role !== ParticipantRole.OWNER
        ) {
          throw new Error("Unauthorized to delete conversation");
        }

        const result = await this.conversationService.deleteConversation(
          chatId,
          userId
        );

        if (!result.success) {
          throw new Error(result.error);
        }

        conversation.data.participants.forEach((participant: any) => {
          this.sendToUser(participant.userId, "chat:deleted", {
            conversationId: chatId,
            deletedBy: userId,
            deletedAt: new Date(),
          });
        });

        io.in(`chat:${chatId}`).socketsLeave(`chat:${chatId}`);
      } catch (error) {
        this.handleError(socket, "chat:error", error);
      }
    });

    socket.on("chat:join", async (data) => {
      try {
        await socket.join(`chat:${data.chatId}`);
        socket.to(`chat:${data.chatId}`).emit("chat:joined", {
          userId: data.userId,
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
          userId: data.userId,
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

    // Group Creation
    socket.on(
      "group:create",
      async (data: {
        name: string;
        participantIds: string[];
        metadata?: any;
      }) => {
        try {
          console.log(data, "group-data");

          const { name, participantIds, metadata } = data;
          const result = await this.groupService.createGroup(
            userId,
            name,
            participantIds,
            metadata
          );

          if (result.success) {
            // Add all participants to the group room
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

    // Group Settings Update
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

    // Member Management
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

    // Group Deletion
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

    // Group Invitations
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

  //auth auth:login, auth:logout auth:status
  //read Receipts //delivered,read,seen

  private setupMessageHandlers(socket: Socket): void {
    //edit,delete,pin,unpin,reply,react,read,delivered,read,seen
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

    socket.on("message:delivered", async () => {
      try {
      } catch (error) {}
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

  private setupChannelHandlers(socket: Socket) {
    //create,delete,join,leave,post,update
  }

  private setupFileHandlers(socket: Socket) {
    // socket.on("file:upload", async (data) => {
    //   try {
    //     const fileBuffer = Buffer.from(data.file, "base64");
    //     const fileData = {
    //       buffer: fileBuffer,
    //       originalname: data.originalname,
    //       mimetype: data.mimetype,
    //       size: data.size,
    //       mimeType: data.mimetype,
    //     };
    //     const uploadResult = await this.fileService.uploadFile(
    //       fileData,
    //       socket.data.userId,
    //       data.conversationId
    //     );
    //     if (uploadResult.success) {
    //       console.log(uploadResult.data, "File upload successful");
    //       const messageData = {
    //         _id: uploadResult.data._id,
    //         conversationId: data.conversationId,
    //         senderId: socket.data.userId,
    //         receiverId: data.receiverId,
    //         content: "content",
    //         // metadata: {s
    //         //   attachments: {
    //         //     id: uploadResult.data._id,
    //         //     type: AttachmentType.IMAGE,
    //         //     url: uploadResult.data.url,
    //         //     size: uploadResult.data.size,
    //         //     name: uploadResult.data.originalName,
    //         //   },
    //         // },
    //         type: MessageType.IMAGE,
    //         status: MessageStatus.SENDING,
    //         timestamp: new Date().toISOString(),
    //       };
    //       const messageResult = await this.messageService.sendMessage(
    //         socket.data.userId,
    //         messageData
    //       );
    //       if (messageResult.success) {
    //         socket.emit("file:uploaded", {
    //           fileId: uploadResult.data.file.fileId,
    //           messageId: messageResult.data._id,
    //         });
    //       }
    //       const conversation =
    //         await this.conversationService.getConversationById(
    //           data.conversationId
    //         );
    //       if (conversation.success) {
    //         if (conversation.data.type === "direct") {
    //           await this.handleDirectMessage(
    //             socket,
    //             messageData,
    //             messageResult
    //           );
    //         } else {
    //           await this.handleGroupMessage(socket, messageData, messageResult);
    //         }
    //       }
    //     } else {
    //       socket.emit("file:error", { error: uploadResult.error });
    //     }
    //   } catch (error) {
    //     this.logger.error("File upload error:", error);
    //     socket.emit("file:error", { error: "File upload failed" });
    //   }
    // });
  }

  private setupTypingHandlers(socket: Socket): void {
    socket.on(
      "typing:start",
      (data: { conversationId: string; userId: string }) => {
        try {
          socket
            .to(`conversation:${data.conversationId}`)
            .emit("typing:start", {
              userId: data.userId,
              conversationId: data.conversationId,
            });
        } catch (error) {
          this.logger.error("Typing indicator error:", error);
        }
      }
    );

    socket.on(
      "typing:stop",
      (data: { conversationId: string; userId: string }) => {
        try {
          socket.to(`conversation:${data.conversationId}`).emit("typing:stop", {
            userId: data.userId,
            conversationId: data.conversationId,
          });
        } catch (error) {
          this.logger.error("Typing indicator error:", error);
        }
      }
    );
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
      io.to(`conversation:${message.conversationId}`).emit(
        "message:new",
        messageData
      );
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
      // ...result.data,
      // _id: result.data._id,
      // senderId: result.data.senderId,
      // receiverId: data.receiverId,
      // conversationType: "direct",
      // timestamp: new Date(),
      // status: MessageStatus.DELIVERED,
      // sender: {
      //   userId: result.data.senderId,
      //   timestamp: new Date(),
      // },
      data,
    });
  }

  private async handleDisconnect(socket: Socket) {
    const { userId } = socket.data;

    try {
      this.onlineUsers.delete(userId);

      await this.userService.updateUserStatus(userId, UserStatus.OFFLINE);

      io.emit("user:status", {
        userId,
        status: "offline",
        timestamp: new Date(),
      });

      this.logger.info(`User ${userId} went offline (no active connections)`);
    } catch (error) {
      this.logger.error(`Disconnect error for user ${userId}:`, error);
    }
  }

  private async handleReconnect(socket: Socket) {
    try {
    } catch (error) {}
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

  private getAttachmentType(mimetype: string): AttachmentType {
    if (mimetype.startsWith("image/")) return AttachmentType.IMAGE;
    if (mimetype.startsWith("video/")) return AttachmentType.VIDEO;
    if (mimetype.startsWith("audio/")) return AttachmentType.AUDIO;
    return AttachmentType.DOCUMENT;
  }

  private getMessageType(mimetype: string): MessageType {
    if (mimetype.startsWith("image/")) return MessageType.IMAGE;
    return MessageType.FILE;
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

const socketService = SocketService.getInstance();
