import { Server, Socket } from "socket.io";
import { ObjectId } from "mongodb";
import Conversation from "../models/conversation";
import User from "../models/user";
import {
  addParticipantsSchema,
  createConversationSchema,
  deleteConversationSchema,
  removeParticipantsSchema,
  updateConversationSchema,
} from "../schemas/conversationSchemas";

interface ConversationCreateData {
  type: string;
  participants: { userId: string; role?: string }[];
  name?: string;
  description?: string;
}

interface AddParticipantsData {
  conversationId: string;
  participants: { userId: string }[];
}

interface RemoveParticipantsData {
  conversationId: string;
  userId: string;
}

interface UpdateConversationData {
  conversationId: string;
  name?: string;
  description?: string;
}

interface DeleteConversationData {
  conversationId: string;
}

export const conversationHandler = (io: Server, socket: Socket): void => {
  // conversation:create event
  socket.on(
    "conversation:create",
    async (data: ConversationCreateData, callback: Function) => {
      // Validate incoming data
      const parsed = createConversationSchema.safeParse(data);
      if (!parsed.success) {
        return callback({
          error: "Validation error",
          details: parsed.error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        });
      }

      try {
        const { type, participants, name, description } = parsed.data;
        const createdBy = socket.data.userId;
        let newConversation;

        if (type === "private") {
          if (participants.length !== 2) {
            return callback({
              error: "Private conversation must have two participants",
            });
          }

          const userIds = participants.map((p) => p.userId);
          if (!userIds.includes(createdBy)) {
            return callback({
              error: "You must be one of the participants in the conversation",
            });
          }

          if (userIds[0] === userIds[1]) {
            return callback({
              error: "You cannot create a private conversation with yourself",
            });
          }

          const users = await User.find({ _id: { $in: userIds } });
          if (users.length !== 2) {
            return callback({
              error: "One or more participants do not exist",
            });
          }

          const existingConversation = await Conversation.findOne({
            type: "private",
            participants: {
              $all: [
                { $elemMatch: { userId: userIds[0] } },
                { $elemMatch: { userId: userIds[1] } },
              ],
            },
          });
          if (existingConversation) {
            return callback({
              error:
                "A private conversation between these users already exists",
            });
          }

          newConversation = new Conversation({
            type: "private",
            participants: participants.map((p) => ({
              userId: p.userId,
              role: "member",
              joinedAt: new Date(),
            })),
            createdBy,
          });

          await newConversation.save();
        } else if (type === "group" || type === "channel") {
          // Ensure the creator is added as admin
          if (!participants.find((p) => p.userId === createdBy)) {
            participants.push({ userId: createdBy, role: "admin" });
          }

          newConversation = new Conversation({
            type,
            name: name || undefined,
            description: description || undefined,
            participants: participants.map((p) => ({
              userId: p.userId,
              role: p.role || "member",
              joinedAt: new Date(),
            })),
            createdBy,
          });

          await newConversation.save();
        } else {
          return callback({ error: "Invalid conversation type" });
        }

        newConversation.participants.forEach((participant: any) => {
          io.to(participant.userId.toString()).emit("conversation:new", {
            message: "A new conversation has been created.",
            data: newConversation,
          });
        });

        return callback(null, {
          message: "Conversation created successfully",
          data: newConversation,
        });
      } catch (error) {
        return callback({
          error: "Error creating conversation",
          details: error,
        });
      }
    }
  );

  // conversation:addParticipants event
  socket.on(
    "conversation:addParticipants",
    async (data: AddParticipantsData, callback: Function) => {
      const parsed = addParticipantsSchema.safeParse(data);
      if (!parsed.success) {
        return callback({
          error: "Validation error",
          details: parsed.error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        });
      }
      try {
        const { conversationId, participants } = parsed.data;
        const currentUserId = socket.data.userId;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          return callback({ error: "Conversation not found" });
        }

        // Only admins can add participants.
        const isAdmin = conversation.participants.some(
          (p: any) =>
            p.userId.toString() === currentUserId && p.role === "admin"
        );
        if (!isAdmin) {
          return callback({ error: "Only admins can add participants" });
        }

        for (const newParticipant of participants) {
          const alreadyExists = conversation.participants.some(
            (p: any) => p.userId.toString() === newParticipant.userId
          );
          if (alreadyExists) {
            return callback({
              error: "One or more users already exist in the conversation",
            });
          }
          conversation.participants.push({
            userId: new ObjectId(newParticipant.userId),
            role: "member",
            joinedAt: new Date(),
          });
        }

        await conversation.save();
        conversation.participants.forEach((participant: any) => {
          io.to(participant.userId.toString()).emit("conversation:updated", {
            message: "New participants have been added to the conversation.",
            data: conversation,
          });
        });

        return callback(null, {
          message: "Participants added successfully",
          data: conversation,
        });
      } catch (error) {
        return callback({
          error: "Error adding participants",
          details: error,
        });
      }
    }
  );

  // conversation:removeParticipants event
  socket.on(
    "conversation:removeParticipants",
    async (data: RemoveParticipantsData, callback: Function) => {
      const parsed = removeParticipantsSchema.safeParse(data);
      if (!parsed.success) {
        return callback({
          error: "Validation error",
          details: parsed.error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        });
      }
      try {
        const { conversationId, userId: removeUserId } = parsed.data;
        const currentUserId = socket.data.userId;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          return callback({ error: "Conversation not found" });
        }

        const isAdmin = conversation.participants.some(
          (p: any) =>
            p.userId.toString() === currentUserId && p.role === "admin"
        );
        if (!isAdmin) {
          return callback({ error: "Only admins can remove participants" });
        }

        const participant = conversation.participants.find(
          (p: any) => p.userId.toString() === removeUserId
        );
        if (!participant) {
          return callback({
            error: "Participant not found in the conversation",
          });
        }

        if (participant.role === "admin") {
          return callback({
            error: "You cannot remove admins from the conversation",
          });
        }

        conversation.participants = conversation.participants.filter(
          (p: any) => p.userId.toString() !== removeUserId
        );

        await conversation.save();

        conversation.participants.forEach((participant: any) => {
          io.to(participant.userId.toString()).emit("conversation:updated", {
            message: "A participant has been removed from the conversation.",
            data: conversation,
          });
        });

        io.to(removeUserId).emit("conversation:removed", {
          message: "You have been removed from the conversation.",
          conversationId,
        });

        return callback(null, {
          message: "Participant removed successfully",
          data: conversation,
        });
      } catch (error) {
        return callback({
          error: "Error removing participant",
          details: error,
        });
      }
    }
  );

  // conversation:update event
  socket.on(
    "conversation:update",
    async (data: UpdateConversationData, callback: Function) => {
      const parsed = updateConversationSchema.safeParse(data);
      if (!parsed.success) {
        return callback({
          error: "Validation error",
          details: parsed.error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        });
      }
      try {
        const { conversationId, name, description } = parsed.data;
        const currentUserId = socket.data.userId;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          return callback({ error: "Conversation not found" });
        }

        // In this example, we require only a member (not strictly admin)
        const isMember = conversation.participants.some(
          (p: any) => p.userId.toString() === currentUserId
        );
        if (!isMember) {
          return callback({
            error: "Unauthorized: only conversation members can update details",
          });
        }

        if (name) conversation.name = name;
        if (description) conversation.descriptions = description;

        await conversation.save();

        conversation.participants.forEach((participant: any) => {
          io.to(participant.userId.toString()).emit("conversation:updated", {
            message: "The conversation details have been updated.",
            data: conversation,
          });
        });

        return callback(null, {
          message: "Conversation updated successfully",
          data: conversation,
        });
      } catch (error) {
        return callback({
          error: "Error updating conversation",
          details: error,
        });
      }
    }
  );

  // conversation:delete event
  socket.on(
    "conversation:delete",
    async (data: DeleteConversationData, callback: Function) => {
      const parsed = deleteConversationSchema.safeParse(data);
      if (!parsed.success) {
        return callback({
          error: "Validation error",
          details: parsed.error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        });
      }
      try {
        const { conversationId } = parsed.data;
        const currentUserId = socket.data.userId;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          return callback({ error: "Conversation not found" });
        }

        const isAuthorized =
          conversation.createdBy.toString() === currentUserId ||
          conversation.participants.some(
            (p: any) =>
              p.userId.toString() === currentUserId && p.role === "admin"
          );
        if (!isAuthorized) {
          return callback({
            error: "You are not authorized to delete this conversation",
          });
        }

        const participantIds = conversation.participants.map((p: any) =>
          p.userId.toString()
        );

        await conversation.deleteOne();

        participantIds.forEach((uid) => {
          io.to(uid).emit("conversation:deleted", {
            message: "A conversation you were part of has been deleted.",
            conversationId,
          });
        });

        return callback(null, {
          message: "Conversation deleted successfully",
        });
      } catch (error) {
        return callback({
          error: "Error deleting conversation",
          details: error,
        });
      }
    }
  );
};
