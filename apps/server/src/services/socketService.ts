import { Socket } from "socket.io";
import { io } from "../utils/socket";
import { AuthService } from "./authService";
import { UserService } from "./userService";
import { MessageService } from "./messageService";
import { UserStatus } from "../types/user.types";
import { BaseService } from "./baseService";
import { ConversationService } from "./conversationService";
import { ConversationType } from "../types/conversation";
import { AttachmentType, MessageStatus, MessageType } from "../types/message";
import { FileService } from "./fileService";

export class SocketService extends BaseService {
  private static instance: SocketService;
  private authService: AuthService;
  private messageService: MessageService;
  private userService: UserService;
  private conversationService: ConversationService;
  private fileService: FileService;

  constructor() {
    super("SocketService");
    this.messageService = new MessageService();
    this.authService = new AuthService();
    this.userService = new UserService();
    this.conversationService = new ConversationService();
    this.fileService = new FileService();
    BaseService.setSocketService(this);
    this.setUpSocketHandler();
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  private setUpSocketHandler() {
    io.use(this.authenticateSocket.bind(this));
    io.on("connection", this.handleSocketConnection.bind(this));
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
      console.log("Authenticated user:", socket.data.userId);

      next();
    } catch (error) {
      this.logger.error("Socket Authentication Error", error);
      next(new Error("Authentication process failed"));
    }
  }

  private async handleSocketConnection(socket: Socket) {
    const userId = socket.data.userId;
    this.logger.info(`Socket Connection Attempt: ${userId}`);

    try {
      await this.initializeUserConnection(socket);
    } catch (error) {
      this.logger.error(
        `Connection Initialization Failed for User ${userId}`,
        error
      );
      socket.disconnect(true);
    }
  }

  private async initializeUserConnection(socket: Socket) {
    const userId = socket.data.userId;
    try {
      socket.join(`user:${userId}`);

      this.logger.info(`user join ${userId}`);

      await this.userService.updateUserStatus(userId, UserStatus.ONLINE);

      // io.emit("user:status", {
      //   userId,
      //   status: "online",
      // });

      const conversations =
        await this.conversationService.getConversationsByUser(userId);

      for (const conv of conversations.data || []) {
        await socket.join(`conversation:${conv._id}`);
        console.log(`User ${userId} joined conversation:${conv._id}`);
        // if (conv.type === "group") {
        //   await socket.join(`group:${conv._id}`);
        // }
      }

      this.setupChatHandlers(socket);
      this.setupTypingHandlers(socket);
      this.setUpGroupHandlers(socket);

      socket.on("disconnect", () => this.handleDisconnect(socket));
    } catch (error) {
      this.logger.error(`Connection initialization error for user ${userId}`);
      socket.disconnect(true);
    }
  }

  private setupChatHandlers(socket: Socket): void {
    socket.on("message:send", async (data) => {
      try {
        const result = await this.messageService.sendMessage(
          socket.data.userId,
          data
        );

        if (!result.success) {
          throw new Error(result.error);
        }

        socket.emit("message:sent", {
          tempId: data.tempId,
          messageId: result.data._id,
          status: "sent",
          timestamp: new Date(),
        });

        await this.deliverMessage(result.data);
      } catch (error) {
        this.logger.error("Message handling error", error);
        socket.emit("message:error", {
          error: "Failed to send message",
        });
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
          this.logger.error("Message read error:", error);
          socket.emit("message:error", {
            error: "Failed to mark messages as read",
          });
        }
      }
    );

    socket.on("file:upload", async (data) => {
      try {
        const fileBuffer = Buffer.from(data.file, "base64");
        const fileData = {
          buffer: fileBuffer,
          originalname: data.originalname,
          mimetype: data.mimetype,
          size: data.size,
          mimeType: data.mimetype,
        };

        const uploadResult = await this.fileService.uploadFile(
          fileData,
          socket.data.userId,
          data.conversationId
        );

        if (uploadResult.success) {
          console.log(uploadResult.data, "File upload successful");
          const messageData = {
            _id: uploadResult.data._id,
            conversationId: data.conversationId,
            senderId: socket.data.userId,
            receiverId: data.receiverId,
            content: "content",
            // metadata: {s
            //   attachments: {
            //     id: uploadResult.data._id,
            //     type: AttachmentType.IMAGE,
            //     url: uploadResult.data.url,
            //     size: uploadResult.data.size,
            //     name: uploadResult.data.originalName,
            //   },
            // },
            type: MessageType.IMAGE,
            status: MessageStatus.SENDING,
            timestamp: new Date().toISOString(),
          };

          const messageResult = await this.messageService.sendMessage(
            socket.data.userId,
            messageData
          );

          if (messageResult.success) {
            socket.emit("file:uploaded", {
              fileId: uploadResult.data.file.fileId,
              messageId: messageResult.data._id,
            });
          }

          const conversation =
            await this.conversationService.getConversationById(
              data.conversationId
            );

          if (conversation.success) {
            if (conversation.data.type === "direct") {
              await this.handleDirectMessage(
                socket,
                messageData,
                messageResult
              );
            } else {
              await this.handleGroupMessage(socket, messageData, messageResult);
            }
          }
        } else {
          socket.emit("file:error", { error: uploadResult.error });
        }
      } catch (error) {
        this.logger.error("File upload error:", error);
        socket.emit("file:error", { error: "File upload failed" });
      }
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
      io.to(`conversation:${message.conversationId}`).emit(
        "message:new",
        messageData
      );
    }
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
          socket
            .to(`conversation:${data.conversationId}`)
            .emit("typing:stop", {
              userId: data.userId,
              conversationId: data.conversationId,
            });
        } catch (error) {
          this.logger.error("Typing indicator error:", error);
        }
      }
    );
  }

  private setUpGroupHandlers(socket: Socket): void {
    socket.on("group:create", async (data) => {
      console.log("Group create request", data);
      try {
        const createGroupData = {
          type: ConversationType.GROUP,
          participantIds: data.participantIds || [],
          metadata: {
            title: data.name || `New Group`,
            description: data.description || "",
            avatar: data.avatar || "",
            isArchived: false,
            isPinned: false,
          },
        };

        const result = await this.conversationService.createGroupConversation(
          socket.data.userId,
          createGroupData
        );

        if (result.success) {
          await socket.join(`group:${result.data._id}`);
          result.data.participants.forEach((participant: any) => {
            this.sendToUser(participant.userId, "group:created", {
              type: "group",
              conversationId: result.data._id,
              title: result.data.metadata?.title,
              createdBy: socket.data.userId,
            });
          });
          socket.emit("group:created:success", {
            groupId: result.data._id,
            message: "Group created successfully",
          });
        } else {
          socket.emit("group:created:error", {
            error: result.error,
          });
        }
      } catch (error) {
        this.logger.error("Group creation error", error);
        socket.emit("group:created:error", {
          error: "Failed to create group",
        });
      }
    });

    socket.on("group:join", (data) => {});

    socket.on("group:leave", (data) => {});

    socket.on("group:invite", (data) => {});
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

  private async handleDisconnect(socket: Socket) {
    const userId = socket.data.userId;

    try {
      const activeConnections = await this.getActiveConnections(userId);
      if (activeConnections === 0) {
        await this.userService.updateUserStatus(userId, UserStatus.OFFLINE);
        io.emit("user:status", {
          userId,
          status: "offline",
        });

        this.logger.info(`User ${userId} went offline (no active connections)`);
      } else {
        this.logger.info(
          `User ${userId} still has ${activeConnections} active connections`
        );
      }
    } catch (error) {
      this.logger.error(`Disconnect error for user ${userId}:`, error);
    }
  }

  private async getActiveConnections(userId: string): Promise<number> {
    const socket = await io.in(`user:${userId}`).fetchSockets();
    return socket.length;
  }

  private async getOnlineGroupParticipants(
    conversationId: string,
    excludeUserId: string
  ): Promise<string[]> {
    try {
      const sockets = await io
        .in(`conversation:${conversationId}`)
        .fetchSockets();
      return sockets
        .map((socket) => socket.data.userId)
        .filter((userId) => userId !== excludeUserId);
    } catch (error) {
      this.logger.error("Error fetching online participants:", error);
      return [];
    }
  }

  public async sendToUser(
    userId: string,
    event: string,
    data: any
  ): Promise<void> {
    io.to(`user:${userId}`).emit(event, data);
  }

  public async broadcastMessage(event: string, data: any): Promise<void> {
    io.emit(event, data);
  }
}

const socketService = SocketService.getInstance();
