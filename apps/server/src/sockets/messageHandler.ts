import { Server, Socket } from "socket.io";
import Conversation from "../models/conversation";
import Message from "../models/message";

interface MessageData {
  conversationId: string;
  type: string;
  content: string;
  tempId?: string;
  attachment?: string;
}

interface EditMessageData {
  messageId: string;
  content: string;
}

interface ReadReceiptData {
  chatId: string;
  messageId: string;
}

export const messageHandler = (io: Server, socket: Socket) => {
  socket.on("sendMessage", async (data: MessageData) => {
    try {
      const { conversationId, content, tempId, type, attachment } = data;

      if (!conversationId || !content) {
        socket.emit("error", { message: "Chat ID and content are required" });
        return;
      }

      const chat = await Conversation.findById(conversationId);
      if (!chat) {
        socket.emit("error", {
          tempId,
          error: "Chat not found",
        });
        return;
      }

      const isMember = chat.participants.find(
        (user) => user.userId.toString() === socket.data.userId
      );

      if (!isMember) {
        socket.emit("error", {
          tempId,
          error: "Not authorized to send messages in this chat",
        });
        return;
      }

      const newMessage = await Message.create({
        senderId: socket.data.userId,
        type,
        content,
        conversationId,
        attachment,
        status: "delivered",
        updatedAt: new Date(),
      });

      const populateMessage = await Message.findById(newMessage._id).populate(
        "senderId",
        "username email profilePicture"
      );

      socket.emit("sentMessage", {
        tempId,
        message: populateMessage,
      });

      socket.to(conversationId).emit("newMessage", {
        message: populateMessage,
      });
    } catch (error) {
      console.log("Error sending message:", error);
      socket.emit("error", error);
    }
  });

  socket.on("editMessage", async (data: EditMessageData) => {
    try {
      const { messageId, content } = data;

      const message = await Message.findById(messageId);
      if (!message) {
        socket.emit("error", { message: "Message not found" });
        return;
      }

      if (message.senderId.toString() !== socket.data.userId) {
        socket.emit("error", {
          message: "Not authorized to edit this message",
        });
        return;
      }
      //check 15 min message btw edit-Time

      const updateMessage = await Message.findByIdAndUpdate(
        messageId,
        {
          content,
          isEdited: true,
          editedAt: new Date(),
        },
        { new: true }
      ).populate("senderId", "username profilePicture");

      const chatId = message.conversationId.toString();

      socket.to(chatId).emit("messageEdited", {
        conversationId: chatId,
        message: updateMessage,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error editing message:", error);
      socket.emit("error", {
        message: "Failed to edit message",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  socket.on("deleteMessage", async (messageId: string) => {
    try {
      console.log(messageId, "deletemEssage");

      const message = await Message.findById(messageId);
      if (!message) {
        socket.emit("error", { message: "Message not found" });
        return;
      }

      if (message.senderId.toString() === socket.data.userId) {
        const chat = await Conversation.findById(
          message.conversationId.toString()
        );
        const isAdmin = chat?.participants.some(
          (p) => p.userId.toString() === socket.data.userId
        );

        if (!isAdmin) {
          socket.emit("error", {
            message: "Not authorized to delete this message",
          });
          return;
        }

        await Message.findByIdAndUpdate(messageId, {
          content: "This message was deleted",
          isDeleted: true,
        });

        const chatId = message.conversationId.toString();
        console.log(chatId);
        socket.to(chatId).emit("messageDeleted", {
          conversationId: chatId,
          messageId,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      socket.emit("error", {
        message: "Failed to delete message",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  socket.on("markMessageAsRead", async (data: ReadReceiptData) => {
    try {
      const { chatId, messageId } = data;

      const message = await Message.findById(messageId);
      if (!message) {
        socket.emit("error", { message: "Message not found" });
        return;
      }

      const conversation = await Conversation.findById(chatId);
      if (
        !conversation ||
        !conversation.participants.some(
          (p) => p.userId.toString() === socket.data.userId
        )
      ) {
        socket.emit("error", { message: "Not authorized to access this chat" });
        return;
      }

      await Message.findByIdAndUpdate(
        messageId,
        { status: "read" },
        { new: true }
      ).populate("senderId", "username profilePicture");

      const chatIdx = message.conversationId.toString();

      socket.to(chatIdx).emit("messageRead", {
        messageId: message._id,
        readBy: socket.data.userId,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error marking message as read:", error);
      socket.emit("error", {
        message: "Failed to mark message as read",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  socket.on("markAllRead", async (chatId: string) => {
    try {
      const conversation = await Conversation.findById(chatId);
      if (!conversation) {
        socket.emit("error", { message: "Conversation not found" });
        return;
      }

      const isParticipant = conversation.participants.some(
        (p) => p.userId.toString() === socket.data.userId
      );
      if (!isParticipant) {
        socket.emit("error", { message: "Not authorized to access this chat" });
        return;
      }

      await Message.updateMany(
        {
          conversationId: chatId,
          status: { $ne: "read" },
          senderId: { $ne: socket.data.userId },
        },
        { status: "read" }
      );

      socket.to(chatId).emit("allMessagesRead", {
        chatId,
        readBy: socket.data.userId,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error marking all messages as read:", error);
      socket.emit("error", {
        message: "Failed to mark all messages as read",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
};
