import { io, Socket } from "socket.io-client";
import { EventEmitter } from "events";
import useAuthStore from "@/store/useAuthStore";
import { Message, MessageResponse } from "@/types/message";

interface TypingData {
  conversationId: string;
  userId: string;
}

export class SocketService extends EventEmitter {
  private socket: Socket | null = null;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private readonly RECONNECT_INTERVAL = 3000;

  constructor() {
    super();
    this.initialize = this.initialize.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  initialize() {
    if (this.socket?.connected) return;

    const token = useAuthStore.getState().accessToken;
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
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Socket connected");
      this.emit("connected");
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      this.emit("disconnected", reason);
    });

    this.socket.on("message:new", (message: Message) => {
      this.emit("message:new", message);
    });

    this.socket.on("message:sent", (response: MessageResponse) => {
      this.emit("message:sent", response);
    });

    this.socket.on("message:delivered", (messageId: string) => {
      this.emit("message:delivered", messageId);
    });

    this.socket.on(
      "message:read:ack",
      (data: {
        messageIds: string[];
        conversationId: string;
        readBy: string;
        timestamp: string;
      }) => {
        this.emit("message:read:ack", data);
      }
    );

    this.socket.on("message:error", (error: any) => {
      this.emit("message:error", error);
    });

    this.socket.on(
      "message:seen",
      (data: { chatId: string; messageId: string }) => {
        this.emit("message:seen", data);
      }
    );

    this.socket.on("typing:start", (data: TypingData) => {
      this.emit("typing:start", data);
    });

    this.socket.on("typing:stop", (data: TypingData) => {
      this.emit("typing:stop", data);
    });
  }

  sendMessage(chatId: string, content: string, tempId?: string) {
    if (!this.socket?.connected) {
      throw new Error("Socket not connected");
    }

    this.socket.emit("message:send", {
      conversationId: chatId,
      content,
      tempId,
    });
  }

  markMessageAsRead(chatId: string, messageIds: string[]) {
    if (!this.socket?.connected) return;

    this.socket.emit("message:read", {
      conversationId: chatId,
      messageIds,
    });
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

  sendTypingStart(conversationId: string, userId: string) {
    if (this.socket?.connected) {
      this.socket.emit("typing:start", {
        conversationId,
        userId,
      });
    }
  }

  sendTypingStop(conversationId: string, userId: string) {
    if (!this.socket?.connected) return;
    console.log("Sending typing stop:", conversationId);
    this.socket.emit("typing:stop", {
      conversationId,
      userId,
    });
  }

  markMessageAsSeen(chatId: string, messageId: string) {
    if (this.socket?.connected) {
      this.socket.emit("message:seen", { chatId, messageId });
    }
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();
