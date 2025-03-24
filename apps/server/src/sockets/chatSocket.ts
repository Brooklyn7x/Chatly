import { Server, Socket } from "socket.io";

export const chatSocket = (io: Server, socket: Socket): void => {
  const typingUsers = new Map<string, Set<string>>();
  const { userId } = socket.data.user;

  socket.on("chat:join", async (data) => {
    try {
      socket.join(`chat:${data.chatId}`);
      console.log(`User ${userId} joined room ${data.chatId}`);
      socket.to(`chat:${data.chatId}`).emit("chat:joined", {
        userId,
        chatId: data.chatId,
      });
    } catch (error) {
      console.log("Error in joining chat", error);
      socket.emit("chat:error", {
        message: "Failed to joined chat, Please try again.",
      });
    }
  });

  socket.on("chat:leave", async (data) => {
    try {
      socket.leave(`chat:${data.chatId}`);
      console.log(`User ${userId} left room ${data.chatId}`);
      socket.to(`chat:${data.chatId}`).emit("chat:left", {
        userId,
        chatId: data.chatId,
      });
    } catch (error) {
      console.log("Error in leaving chat", error);
      socket.emit("chat:error", {
        message: "Failed to left chat, Please try again.",
      });
    }
  });

  socket.on("typing:start", async (data: { conversationId: string }) => {
    console.log(data, "typing socket");
    const { conversationId } = data;

    if (!typingUsers.has(conversationId)) {
      typingUsers.set(conversationId, new Set());
    }
    typingUsers.get(conversationId)?.add(userId);

    socket.to(`chat:${conversationId}`).emit("typing:start", {
      conversationId,
      userIds: Array.from(typingUsers.get(conversationId) || []),
    });
  });

  socket.on("typing:stop", async (data: { conversationId: string }) => {
    console.log(data, "typing stop");
    const { conversationId } = data;

    socket.to(`chat:${conversationId}`).emit("typing:stop", {
      conversationId,
      userIds: Array.from(typingUsers.get(conversationId) || []),
    });
    typingUsers.get(conversationId)?.delete(userId);
  });
};
