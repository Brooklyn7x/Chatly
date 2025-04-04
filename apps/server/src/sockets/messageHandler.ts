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
  socket.on("message_sent", async (data: MessageData) => {
    try {
      const { conversationId, content, tempId, type, attachment } = data;

      if (!conversationId || !content) {
        socket.emit("message_error", {
          message: "Chat ID and content are required",
        });
        return;
      }

      const chat = await Conversation.findById(conversationId);
      if (!chat) {
        socket.emit("message_error", {
          message: "Chat not found",
        });
        return;
      }

      const isMember = chat.participants.find(
        (user) => user.userId.toString() === socket.data.userId
      );

      if (!isMember) {
        socket.emit("message_error", {
          message: "Not authorized to send messages in this chat",
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

      socket.emit("message_ack", {
        tempId,
        message: populateMessage,
      });

      socket.to(conversationId).emit("message_new", {
        message: populateMessage,
      });
    } catch (error) {
      console.log("Error sending message:", error);
      socket.emit("message_error", {
        message: "Something went wrong",
      });
    }
  });

  socket.on("message_edit", async (data: EditMessageData) => {
    try {
      const { messageId, content } = data;

      const message = await Message.findById(messageId);
      if (!message) {
        socket.emit("message_error", { message: "Message not found" });
        return;
      }

      if (message.senderId.toString() !== socket.data.userId) {
        socket.emit("message_error", {
          message: "Not authorized to edit this message",
        });
        return;
      }

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

      socket.to(chatId).emit("message_edited", {
        conversationId: chatId,
        message: updateMessage,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error editing message:", error);
      socket.emit("message_error", {
        message: "Failed to edit message",
      });
    }
  });

  socket.on("message_delete", async (messageId: string) => {
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        socket.emit("message_error", { message: "Message not found" });
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
          socket.emit("message_error", {
            message: "Not authorized to delete this message",
          });
          return;
        }

        await Message.findByIdAndUpdate(messageId, {
          content: "This message was deleted",
          isDeleted: true,
        });

        const chatId = message.conversationId.toString();
        socket.to(chatId).emit("message_deleted", {
          conversationId: chatId,
          messageId,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      socket.emit("message_error", {
        message: "Failed to delete message",
      });
    }
  });

  socket.on("mark_as_read", async (data: ReadReceiptData) => {
    try {
      const { chatId, messageId } = data;

      const message = await Message.findById(messageId);
      if (!message) {
        socket.emit("message_error", { message: "Message not found" });
        return;
      }

      const conversation = await Conversation.findById(chatId);
      if (
        !conversation ||
        !conversation.participants.some(
          (p) => p.userId.toString() === socket.data.userId
        )
      ) {
        socket.emit("message_error", {
          message: "Not authorized to access this chat",
        });
        return;
      }

      await Message.findByIdAndUpdate(
        messageId,
        { status: "read" },
        { new: true }
      ).populate("senderId", "username profilePicture");

      const chatIdx = message.conversationId.toString();

      socket.to(chatIdx).emit("message_read", {
        messageId: message._id,
        readBy: socket.data.userId,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error marking message as read:", error);
      socket.emit("message_error", {
        message: "Failed to mark message as read",
      });
    }
  });

  socket.on("mark_all_read", async (data: { chatId: string }) => {
    try {
      const { chatId } = data;
      const conversation = await Conversation.findById(chatId);
      if (!conversation) {
        socket.emit("messsage_error", { message: "Conversation not found" });
        return;
      }

      const isParticipant = conversation.participants.some(
        (p) => p.userId.toString() === socket.data.userId
      );
      if (!isParticipant) {
        socket.emit("messsage_error", {
          message: "Not authorized to access this chat",
        });
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

      socket.to(chatId).emit("message_all_read", {
        chatId,
        readBy: socket.data.userId,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error marking all messages as read:", error);
      socket.emit("message_error", {
        message: "Failed to mark all messages as read",
      });
    }
  });
};
