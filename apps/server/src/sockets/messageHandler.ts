import { Server, Socket } from "socket.io";
import Conversation from "../models/conversation";
import Message from "../models/message";
import {
  messageSentSchema,
  messageEditSchema,
  messageDeleteSchema,
  markAsReadSchema,
  markAllReadSchema,
} from "../schemas/messageSchemas";

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
  socket.on("message_sent", async (data: unknown) => {
    const parsed = messageSentSchema.safeParse(data);
    if (!parsed.success) {
      return socket.emit("message_error", {
        message: "Validation error",
        details: parsed.error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });
    }
    const { conversationId, content, tempId, type, attachment } =
      parsed.data as MessageData;

    try {
      if (!conversationId || !content) {
        return socket.emit("message_error", {
          message: "Chat ID and content are required",
        });
      }

      const chat = await Conversation.findById(conversationId);
      if (!chat) {
        return socket.emit("message_error", {
          message: "Chat not found",
        });
      }

      const isMember = chat.participants.find(
        (user: any) => user.userId.toString() === socket.data.userId
      );
      if (!isMember) {
        return socket.emit("message_error", {
          message: "Not authorized to send messages in this chat",
        });
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

      const populatedMessage = await Message.findById(newMessage._id).populate(
        "senderId",
        "username email profilePicture"
      );

      socket.emit("message_ack", {
        tempId,
        message: populatedMessage,
      });
      socket.to(conversationId).emit("message_new", {
        message: populatedMessage,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("message_error", { message: "Something went wrong" });
    }
  });

  // When a message is edited
  socket.on("message_edit", async (data: unknown) => {
    const parsed = messageEditSchema.safeParse(data);
    if (!parsed.success) {
      return socket.emit("message_error", {
        message: "Validation error",
        details: parsed.error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });
    }
    const { messageId, content } = parsed.data as EditMessageData;

    try {
      const message = await Message.findById(messageId);
      if (!message) {
        return socket.emit("message_error", { message: "Message not found" });
      }

      if (message.senderId.toString() !== socket.data.userId) {
        return socket.emit("message_error", {
          message: "Not authorized to edit this message",
        });
      }

      const updatedMessage = await Message.findByIdAndUpdate(
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
        message: updatedMessage,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error editing message:", error);
      socket.emit("message_error", { message: "Failed to edit message" });
    }
  });

  socket.on("message_delete", async (data: unknown) => {
    const parsed = messageDeleteSchema.safeParse(data);
    if (!parsed.success) {
      return socket.emit("message_error", {
        message: "Validation error",
        details: parsed.error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });
    }
    const messageId = parsed.data as string;

    try {
      const message = await Message.findById(messageId);
      if (!message) {
        return socket.emit("message_error", { message: "Message not found" });
      }

      if (message.senderId.toString() !== socket.data.userId) {
        return socket.emit("message_error", {
          message: "Not authorized to delete this message",
        });
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
    } catch (error) {
      console.error("Error deleting message:", error);
      socket.emit("message_error", { message: "Failed to delete message" });
    }
  });

  socket.on("mark_as_read", async (data: unknown) => {
    const parsed = markAsReadSchema.safeParse(data);
    if (!parsed.success) {
      return socket.emit("message_error", {
        message: "Validation error",
        details: parsed.error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });
    }
    const { chatId, messageId } = parsed.data as ReadReceiptData;

    try {
      const message = await Message.findById(messageId);
      if (!message) {
        return socket.emit("message_error", { message: "Message not found" });
      }

      const conversation = await Conversation.findById(chatId);
      if (
        !conversation ||
        !conversation.participants.some(
          (p: any) => p.userId.toString() === socket.data.userId
        )
      ) {
        return socket.emit("message_error", {
          message: "Not authorized to access this chat",
        });
      }

      await Message.findByIdAndUpdate(
        messageId,
        { status: "read" },
        { new: true }
      ).populate("senderId", "username profilePicture");

      socket.to(chatId).emit("message_read", {
        messageId: message._id,
        readBy: socket.data.userId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error marking message as read:", error);
      socket.emit("message_error", {
        message: "Failed to mark message as read",
      });
    }
  });

  socket.on("mark_all_read", async (data: unknown) => {
    const parsed = markAllReadSchema.safeParse(data);
    if (!parsed.success) {
      return socket.emit("message_error", {
        message: "Validation error",
        details: parsed.error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });
    }
    const { chatId } = parsed.data as { chatId: string };
    try {
      const conversation = await Conversation.findById(chatId);
      if (!conversation) {
        return socket.emit("message_error", {
          message: "Conversation not found",
        });
      }

      const isParticipant = conversation.participants.some(
        (p: any) => p.userId.toString() === socket.data.userId
      );
      if (!isParticipant) {
        return socket.emit("message_error", {
          message: "Not authorized to access this chat",
        });
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
