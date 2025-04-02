import { Server, Socket } from "socket.io";
import Conversation from "../models/conversation";
import User from "../models/user";
import { ObjectId } from "mongodb";

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
  socket.on(
    "conversation:create",
    async (data: ConversationCreateData, callback: Function) => {
      try {
        const { type, participants, name, description } = data;
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
            return callback({ error: "One or more participants do not exist" });
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
          if (participants.find((p) => p.userId === createdBy)) {
            participants.push({ userId: createdBy, role: "admin" });
          }

          newConversation = new Conversation({
            type,
            name: type === "group" || type === "channel" ? name : undefined,
            description:
              type === "group" || type === "channel" ? description : undefined,
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

  socket.on(
    "conversation:addParticipants",
    async (data: AddParticipantsData, callback: Function) => {
      try {
        console.log(data);
        const { conversationId, participants } = data;
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

  socket.on(
    "conversation:removeParticipants",
    async (data: RemoveParticipantsData, callback: Function) => {
      try {
        const { conversationId, userId: removeUserId } = data;
        const currentUserId = socket.data.userId;
        console.log(conversationId, removeUserId);
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

  socket.on(
    "conversation:update",
    async (data: UpdateConversationData, callback: Function) => {
      try {
        const { conversationId, name, description } = data;
        const currentUserId = socket.data.userId;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          return callback({ error: "Conversation not found" });
        }

        const isAdmin = conversation.participants.some(
          (p: any) => p.userId.toString() === currentUserId
        );
        if (!isAdmin) {
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

  socket.on(
    "conversation:delete",
    async (data: DeleteConversationData, callback: Function) => {
      try {
        const { conversationId } = data;
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

        participantIds.forEach((userId) => {
          io.to(userId).emit("conversation:deleted", {
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
