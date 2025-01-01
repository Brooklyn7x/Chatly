import { Socket } from "socket.io";
import { io } from "../utils/socket";
import { AuthService } from "./auth.service";
import { UserService } from "./user.service";
import { MessageService } from "./message.service";
import { UserStatus } from "../types/user.types";
import { BaseService } from "./base.service";
import { ConversationService } from "./conversation.service";
import { ConversationType } from "../types/conversation";

export class SocketService extends BaseService {
  private static instance: SocketService;
  private authService: AuthService;
  private messageService: MessageService;
  private userService: UserService;
  private conversationService: ConversationService;

  constructor() {
    super("SocketService");
    this.messageService = new MessageService();
    this.authService = new AuthService();
    this.userService = new UserService();
    this.conversationService = new ConversationService();
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
      // await this.userService.updateUserStatus(userId, UserStatus.ONLINE);

      const conversations =
        await this.conversationService.getUserConversations(userId);
      for (const conversation of conversations?.data || []) {
        if (conversation.type === "group") {
          socket.join(`group:${conversation._id}`);
        }
      }
      this.setUpGroupHandlers(socket);
      this.setupChatHandlers(socket);
      this.setupTypingHandlers(socket);

      socket.on("disconnect", () => this.handleDisconnect(socket));
    } catch (error) {
      this.logger.error(`Connection initialization error for user ${userId}`);
      socket.disconnect(true);
    }
  }

  private setupChatHandlers(socket: Socket): void {
    socket.on("message:send", async (data) => {
      try {
        //validate message data

        const result = await this.messageService.sendMessage(
          socket.data.userId,
          data
        );
        console.log("Message send result", result);
        if (result.success) {
          socket.emit("message:sent", {
            messageId: result.data._id,
            status: "sent",
            timestamp: new Date(),
          });
          console.log(result.data.conversationId.toString());

          const conversation =
            await this.conversationService.getUserConversation(
              data.conversationId.toString(),
              socket.data.userId
            );

          console.log("Conversation data", conversation);
          if (conversation.success && conversation.data) {
            if (conversation.data.type === "direct") {
              await this.handleDirectMessage(socket, data, result);
            } else {
              await this.handleGroupMessage(socket, data, result);
            }
          }

          // if (data.groupId) {
          //   await this.handleGroupMessage(socket, data, result);
          // } else {
          //   await this.handleDirectMessage(socket, data, result);
          // }
        } else {
          socket.emit("message:error", {
            error: result.error,
            messageId: data.messageId,
          });
        }
      } catch (error) {
        this.logger.error("Message handling error", error);
        socket.emit("message:error", {
          error: "Failed to send message",
        });
      }
    });
  }

  private setupTypingHandlers(socket: Socket): void {
    socket.on("typing:start", (data) => {
      io.to(`user:${data.receiverId}`).emit("typing:update", {
        userId: socket.data.userId,
        isTyping: true,
      });
    });

    socket.on("typing:stop", (data) => {
      io.to(`user:${data.receiverId}`).emit("typing:update", {
        userId: socket.data.userId,
        isTyping: false,
      });
    });
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
    io.to(`group:${data.groupId}`).emit("message:new", {
      ...result.data,
      type: "group",
      userId: result.data.userId,
      sender: {
        userId: result.data.userId,
        time: new Date(),
      },
    });
  }

  private async handleDirectMessage(socket: Socket, data: any, result: any) {
    io.to(`user:${data.receiverId}`).emit("message:new", {
      ...result.data,
      userId: result.data.userId,
      sender: {
        userId: result.data.userId,
        time: new Date(),
      },
    });
  }

  private async handleDisconnect(socket: Socket) {
    const userId = socket.data.userId;

    try {
      const connection = await this.getActiveConnections(userId);
      if (connection === 0) {
        await this.userService.updateUserStatus(userId, UserStatus.OFFLINE);
      }

      io.emit("user:status", {
        userId,
        status: "offline",
      });

      this.logger.info(`User ${userId} disconnected`);
    } catch (error) {
      this.logger.error(`Disconnect error for user ${userId}:`, error);
    }
  }

  private async getActiveConnections(userId: string): Promise<number> {
    const socket = await io.in(`user:${userId}`).fetchSockets();
    return socket.length;
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
