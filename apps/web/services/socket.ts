import { io, Socket } from "socket.io-client";

interface Message {
  senderId: string;
  receiverId: string;
  content: string;
  conversationId: string;
  type: string;
}

class SocketService {
  private socket: Socket | null = null;

  connect(token: string): void {
    this.socket = io("http://localhost:8000", {
      auth: {
        token,
      },
    });

    this.socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    this.socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  sendMessage(message: Message): void {
    if (this.socket) {
      this.socket.emit("message:send", message);
    }
  }

  onMessageReceived(callback: (message: Message) => void): void {
    if (this.socket) {
      this.socket.on("message:new", callback);
    }
  }

  startTyping(receiverId: string): void {
    if (this.socket) {
      this.socket.emit("typing:start", { receiverId });
    }
  }

  stopTyping(receiverId: string): void {
    if (this.socket) {
      this.socket.emit("typing:stop", { receiverId });
    }
  }

  onTypingUpdate(
    callback: (data: { userId: string; isTyping: boolean }) => void
  ): void {
    if (this.socket) {
      this.socket.on("typing:update", callback);
    }
  }
}

const socketService = new SocketService();
export default socketService;
