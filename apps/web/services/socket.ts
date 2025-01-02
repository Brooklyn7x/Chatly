import { io, Socket } from "socket.io-client";

interface Message {
  senderId: string;
  receiverId?: string;
  groupId?: string;
  content: string;
  conversationId: string;
  type: string;
}

interface GroupCreateData {
  name: string;
  description?: string;
  participants: string[];
}

interface GroupResponse {
  conversationId: string;
  title: string;
  createdBy: string;
}

class SocketService {
  private socket: Socket | null = null;
  private messageCallbacks: ((message: Message) => void)[] = [];
  private typingCallbacks: ((data: {
    userId: string;
    isTyping: boolean;
  }) => void)[] = [];
  private groupCallbacks: ((data: GroupResponse) => void)[] = [];

  connect(token: string): void {
    if (this.socket?.connected) return;

    this.socket = io("http://localhost:8000", {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    this.socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    this.socket.on("message:new", (message: Message) => {
      this.messageCallbacks.forEach((callback) => callback(message));
    });

    this.socket.on("message:sent", (response) => {
      console.log("Message sent confirmation:", response);
    });

    this.socket.on("message:error", (error) => {
      console.error("Message error:", error);
    });

    this.socket.on("group:created", (data: GroupResponse) => {
      this.groupCallbacks.forEach((callback) => callback(data));
    });

    this.socket.on("group:create:error", (error) => {
      console.error("Group creation error:", error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(message: Message): void {
    console.log("Sending message:", message);
    if (!this.socket?.connected) {
      console.error("Socket not connected");
      return;
    }

    this.socket.emit("message:send", message);
  }

  onMessageReceived(callback: (message: Message) => void): () => void {
    this.messageCallbacks.push(callback);
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(
        (cb) => cb !== callback
      );
    };
  }

  startTyping(receiverId: string): void {
    if (!this.socket?.connected) return;
    this.socket.emit("typing:start", { receiverId });
  }

  stopTyping(receiverId: string): void {
    if (!this.socket?.connected) return;
    this.socket.emit("typing:stop", { receiverId });
  }

  onTypingUpdate(
    callback: (data: { userId: string; isTyping: boolean }) => void
  ): () => void {
    this.typingCallbacks.push(callback);
    return () => {
      this.typingCallbacks = this.typingCallbacks.filter(
        (cb) => cb !== callback
      );
    };
  }

  createGroup(data: {
    name?: string;
    description?: string;
    participantIds: string[];
    avatar?: string;
  }): Promise<GroupResponse> {
    console.log("Creating group with participants:", data);
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error("Socket not connected"));
        return;
      }

      this.socket.emit("group:create", data);

      const handleSuccess = (response: GroupResponse) => {
        this.socket?.off("group:created", handleSuccess);
        this.socket?.off("group:create:error", handleError);
        resolve(response);
      };

      const handleError = (error: any) => {
        this.socket?.off("group:created", handleSuccess);
        this.socket?.off("group:create:error", handleError);
        reject(error);
      };

      this.socket.once("group:created", handleSuccess);
      this.socket.once("group:create:error", handleError);
    });
  }

  onGroupCreated(callback: (data: GroupResponse) => void): () => void {
    this.groupCallbacks.push(callback);
    return () => {
      this.groupCallbacks = this.groupCallbacks.filter((cb) => cb !== callback);
    };
  }

  joinGroup(conversationId: string): void {
    if (!this.socket?.connected) return;
    this.socket.emit("group:join", { conversationId });
  }

  leaveGroup(conversationId: string): void {
    if (!this.socket?.connected) return;
    this.socket.emit("group:leave", { conversationId });
  }
}

const socketService = new SocketService();
export default socketService;
