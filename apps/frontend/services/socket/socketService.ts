// src/services/socket/SocketService.ts
import { io, Socket } from "socket.io-client";
import { EventEmitter } from "events";
import useAuthStore from "@/store/useAuthStore";

export class SocketService extends EventEmitter {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private readonly RECONNECT_INTERVAL = 3000;
  private pingInterval: NodeJS.Timer | null = null;

  constructor() {
    super();
    this.initialize = this.initialize.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  initialize() {
    if (this.socket?.connected) return;

    const token = useAuthStore.getState().token;
    if (!token) {
      throw new Error("No authentication token found");
    }

    this.socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL!, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: this.MAX_RECONNECT_ATTEMPTS,
      reconnectionDelay: this.RECONNECT_INTERVAL,
      timeout: 10000,
    });

    this.setupEventListeners();
    this.setupPing();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on("connect", this.handleConnect.bind(this));
    this.socket.on("disconnect", this.handleDisconnect.bind(this));
    this.socket.on("error", this.handleError.bind(this));
    this.socket.on("reconnect_attempt", this.handleReconnectAttempt.bind(this));
    this.socket.on("reconnect_failed", this.handleReconnectFailed.bind(this));

    // Chat events
    this.socket.on("message:new", this.handleNewMessage.bind(this));
    this.socket.on("message:update", this.handleMessageUpdate.bind(this));
    this.socket.on("message:delete", this.handleMessageDelete.bind(this));
    this.socket.on("message:seen", this.handleMessageSeen.bind(this));

    // Typing events
    this.socket.on("user:typing", this.handleUserTyping.bind(this));
    this.socket.on("user:stop_typing", this.handleUserStopTyping.bind(this));

    // Presence events
    this.socket.on("user:online", this.handleUserOnline.bind(this));
    this.socket.on("user:offline", this.handleUserOffline.bind(this));
  }

  //   private setupPing() {
  //     if (this.pingInterval) {
  //       clearInterval(this.pingInterval);
  //     }

  //     this.pingInterval = setInterval(() => {
  //       if (this.socket?.connected) {
  //         this.socket.emit("ping");
  //       }
  //     }, 30000); // 30 seconds
  //   }

  // Connection Handlers
  private handleConnect() {
    console.log("Socket connected");
    this.reconnectAttempts = 0;
    this.emit("connected");
  }

  private handleDisconnect(reason: string) {
    console.log("Socket disconnected:", reason);
    this.emit("disconnected", reason);

    if (reason === "io server disconnect") {
      // Server disconnected us, try to reconnect
      this.socket?.connect();
    }
  }

  private handleError(error: Error) {
    console.error("Socket error:", error);
    this.emit("error", error);
  }

  private handleReconnectAttempt(attempt: number) {
    console.log(`Reconnection attempt ${attempt}`);
    this.reconnectAttempts = attempt;
    this.emit("reconnecting", attempt);
  }

  private handleReconnectFailed() {
    console.log("Reconnection failed");
    this.emit("reconnect_failed");
  }

  // Message Handlers
  private handleNewMessage(message: any) {
    this.emit("message:new", message);
  }

  private handleMessageUpdate(message: any) {
    this.emit("message:update", message);
  }

  private handleMessageDelete(messageId: string) {
    this.emit("message:delete", messageId);
  }

  private handleMessageSeen(data: {
    chatId: string;
    userId: string;
    messageId: string;
  }) {
    this.emit("message:seen", data);
  }

  // Typing Handlers
  private handleUserTyping(data: { chatId: string; userId: string }) {
    this.emit("user:typing", data);
  }

  private handleUserStopTyping(data: { chatId: string; userId: string }) {
    this.emit("user:stop_typing", data);
  }

  // Presence Handlers
  private handleUserOnline(userId: string) {
    this.emit("user:online", userId);
  }

  private handleUserOffline(userId: string) {
    this.emit("user:offline", userId);
  }

  // Public Methods
  sendMessage(chatId: string, content: string, attachments?: File[]) {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error("Socket not connected"));
        return;
      }

      this.socket.emit(
        "message:send",
        { chatId, content, attachments },
        (response: any) => {
          if (response.error) {
            reject(new Error(response.error));
          } else {
            resolve(response);
          }
        }
      );
    });
  }

  markMessageAsSeen(chatId: string, messageId: string) {
    if (this.socket?.connected) {
      this.socket.emit("message:seen", { chatId, messageId });
    }
  }

  sendTypingStatus(chatId: string, isTyping: boolean) {
    if (this.socket?.connected) {
      this.socket.emit(isTyping ? "user:typing" : "user:stop_typing", {
        chatId,
      });
    }
  }

  joinChat(chatId: string) {
    if (this.socket?.connected) {
      this.socket.emit("chat:join", { chatId });
    }
  }

  leaveChat(chatId: string) {
    if (this.socket?.connected) {
      this.socket.emit("chat:leave", { chatId });
    }
  }

  disconnect() {
    // if (this.pingInterval) {
    //   clearInterval(this.pingInterval);
    // }
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();
