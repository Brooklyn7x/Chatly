import { io, Socket } from "socket.io-client";
import { EventEmitter } from "events";
import useAuthStore from "@/store/useAuthStore";

export class SocketService extends EventEmitter {
  private socket: Socket | null = null;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private readonly RECONNECT_INTERVAL = 3000;

  constructor() {
    super();
    this.initialize = this.initialize.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  async initialize() {
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

    this.socket.on("chat:error", (error: any) => {
      this.emit("chat:error", error);
    });

    this.socket.on("message:new", (message: any) => {
      this.emit("message:new", message);
    });

    this.socket.on("message:sent", (response: any) => {
      this.emit("message:sent", response);
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

    this.socket.on("message:edited", (data: any) => {
      this.emit("message:edited", data);
    });
    this.socket.on("message:deleted", (data: any) => {
      this.emit("message:deleted", data);
    });

    this.socket.on("message:error", (error: any) => {
      this.emit("message:error", error);
    });

    this.socket.on("typing:start", (data: any) => {
      this.emit("typing:start", data);
    });

    this.socket.on("typing:stop", (data: any) => {
      this.emit("typing:stop", data);
    });

    this.socket.on("group:joined", (data) => {
      this.emit("group:joined", data);
    });

    this.socket.on("group:member_added", (data) => {
      this.socket?.emit("group:member_added", data);
    });

    this.socket.on("group:member_removed", (data) => {
      this.socket?.emit("group:member_removed", data);
    });

    this.socket.on("group:updated", (data) => {
      this.emit("group:updated", data);
    });

    this.socket.on("group:invite_sent", (data) => {
      this.emit("group:invite_sent", data);
    });

    this.socket.on("group:invite_received", (data) => {
      this.emit("group:invite_received", data);
    });

    this.socket.on("group:error", (error) => {
      this.emit("group:error", error);
    });

    this.socket.on("user:status_change", (data: any) => {
      this.emit("user:status_change", data);
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

  editMessage(messageId: string, content: string) {
    if (!this.socket?.connected) {
      throw new Error("Socket not connected");
    }
    this.socket.emit("message:edit", {
      messageId,
      content,
    });
  }
  deleteMessage(messageId: string) {
    if (!this.socket?.connected) {
      throw new Error("Socket not connected");
    }
    this.socket.emit("message:delete", {
      messageId,
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

  updateChat(data: any) {
    if (this.socket?.connected) {
      this.socket.emit("chat:update", { data });
    }
  }

  updateGroupSetting(data: any) {
    if (this.socket?.connected) {
      this.socket.emit("group:update_settings", { data });
    }
  }

  addGroupMember(data: any) {
    if (this.socket?.connected) {
      this.socket.emit("group:add_member", { data });
    }
  }

  removeGroupMember(data: any) {
    if (this.socket?.connected) {
      this.socket.emit("group:remove_member", { data });
    }
  }

  joinGroup(data: { groupId: string }) {
    if (this.socket?.connected) {
      this.socket.emit("group:join", data);
    }
  }

  leaveGroup(data: any) {
    if (this.socket?.connected) {
      this.socket.emit("group:leave", { data });
    }
  }

  updateGroup(data: any) {
    if (this.socket?.connected) {
      this.socket.emit("group:update", { data });
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
    this.socket.emit("typing:stop", {
      conversationId,
      userId,
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();
