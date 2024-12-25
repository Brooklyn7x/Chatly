import { Socket } from "socket.io";
import { AuthService } from "./auth.service";
import { UserService } from "./user.service";
import { MessageService } from "./message.service";
import { UserStatus } from "../types/user.types";
import { io } from "../utils/socket";
import { BaseService } from "./base.service";

export class SocketService extends BaseService {
  private static instance: SocketService;
  private authService: AuthService;
  private messageService: MessageService;
  private userService: UserService;

  constructor() {
    super("SocketService");
    this.messageService = new MessageService();
    this.authService = new AuthService();
    this.userService = new UserService();
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
    await this.userService.updateUserStatus(userId, UserStatus.ONLINE);
    socket.join(`user:${userId}`);
    this.setupChatHandlers(socket);
    this.setupTypingHandlers(socket);
    socket.on("disconnect", () => this.handleDisconnect(socket));
  }

  private setupChatHandlers(socket: Socket): void {
    socket.on("message:send", async (data) => {
      try {
        const result = await this.messageService.sendMessage(
          socket.data.userId,
          data
        );

        console.log("Message sent:", result);

        if (result.success) {
          socket.emit("message:sent", {
            messageId: result.data._id,
            status: "sent",
          });

          io.to(`user:${data.receiverId}`).emit("message:new", {
            ...result.data,
            id: result.data._id,
          });
        } else {
          socket.emit("message:error", {
            error: result.error,
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
