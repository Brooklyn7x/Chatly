import { Server, Socket } from "socket.io";
import { redisClient } from "../config/redis";
import { MessageModel } from "../models/message";

export class ChatService {
  io: Server;

  constructor(io: Server) {
    this.io = io;
    this.handleConnection = this.handleConnection.bind(this);
  }

  public initializeSocket(): void {
    console.log("Socket service initialized");
    this.io.on("connection", this.handleConnection);
  }

  private handleConnection(socket: Socket): void {
    const userId = socket.handshake.auth.id;

    console.log("New connection - Socket ID:", socket.id, "User ID:", userId);

    if (!userId) {
      console.error("No user ID provided");
      socket.emit("error", { message: "No user ID provided" });
      return;
    }

    socket.join(userId);

    // Store socket mapping in Redis
    redisClient
      .set(`user:${userId}:socket`, socket.id)
      .then(() => console.log(`Stored socket mapping for user ${userId}`))
      .catch((error) => console.error("Redis error:", error));

    socket.on("message", async (data) => {
      console.log("Received message data:", data);

      try {
        if (!data.content || !data.receiverId) {
          throw new Error("Invalid message data");
        }

        const message = {
          senderId: userId,
          receiverId: data.receiverId,
          content: data.content,
        };

        // const message = await MessageModel.create(messageData);
        // console.log("Message saved:", message);

        // Send confirmation to sender
        socket.emit("message:sent", message);

        // Get receiver's socket ID from Redis
        const receiverSocketId = await redisClient.get(
          `user:${data.receiverId}:socket`
        );
        console.log("Receiver socket ID:", receiverSocketId);

        if (receiverSocketId) {
          this.io.to(receiverSocketId).emit("message", message);
          console.log("Message sent to receiver");
        } else {
          console.log("Receiver not online");
        }
      } catch (error: any) {
        console.error("Error handling message:", error);
        socket.emit("error", {
          message: "Failed to send message",
          details: error.message,
        });
      }
    });

    socket.on("typing_start", async (data) => {
      try {
        const receiverSocketId = await redisClient.get(
          `user:${data.receiverId}:socket`
        );
        if (receiverSocketId) {
          this.io.to(receiverSocketId).emit("typing_start", receiverSocketId);
          console.log("typing_started");
        }
      } catch (error) {
        console.error("Error in typing_start:", error);
      }
    });

    socket.on("typing_stop", async (data) => {
      try {
        const receiverSocketId = await redisClient.get(
          `user:${data.receiverId}:socket`
        );
        if (receiverSocketId) {
          this.io
            .to(receiverSocketId)
            .emit("typing_stop", { senderId: userId });
          console.log("Sent typing stop to receiver");
        }
      } catch (error) {
        console.error("Error in typing_stop:", error);
      }
    });

    socket.on("disconnect", async () => {
      console.log(`User ${userId} disconnected`);
      try {
        await redisClient.del(`user:${userId}:socket`);
        console.log(`Removed socket mapping for user ${userId}`);
      } catch (error) {
        console.error("Redis error on disconnect:", error);
      }
    });
  }
}
