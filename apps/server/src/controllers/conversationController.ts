import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import Conversation from "../models/conversation";

export const createConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, participants, name, description } = req.body;
    const id = req.user?.id;

    if (type === "private") {
      if (participants.length !== 2) {
        res
          .status(404)
          .json({ message: "Private conversation must have two participants" });
        return;
      }

      const userIds = participants.map((p: any) => p.userId);

      if (!userIds.includes(id)) {
        res.status(403).json({
          message: "You must be one of the participants in the conversation",
        });
        return;
      }

      if (userIds[0] === userIds[1]) {
        res.status(400).json({
          message: "You cannot create a private conversation with yourself",
        });
        return;
      }

      const users = await User.find({ _id: userIds });
      if (users.length !== 2) {
        res
          .status(404)
          .json({ message: "One or more participants do not exist" });
        return;
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
        res.status(400).json({
          message: "A private conversation between users already exits",
        });
        return;
      }

      const newConversation = new Conversation({
        type: "private",
        participants: participants.map((p: any) => ({
          userId: p.userId,
          role: "member",
          joinedAt: new Date(),
        })),
        createdBy: id,
      });

      await newConversation.save();

      res.status(201).json({
        message: "Private conversation created successfully",
        data: newConversation,
      });
      return;
    }
    if (type === "group" || type === "channel") {
      if (participants.find((p: any) => p.userId === id)) {
        participants.push({ userId: id, role: "admin" });
      }

      const newConversation = new Conversation({
        type,
        name: type === "group" || type === "channel" ? name : undefined,
        description:
          type === "group" || type === "channel" ? description : undefined,
        participants: participants.map((p: any) => ({
          userId: p.userId,
          role: p.role || "member",
          joinedAt: new Date(),
        })),
        createdBy: id,
      });

      await newConversation.save();

      res.status(201).json({
        message: "Group/Channel conversation created successfully",
        data: newConversation,
      });
      return;
    }

    res.status(400).json({ message: "Invalid conversation type" });
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    const limit = parseInt(req.query.limit as string) || 5;
    const cursor = req.query.cursor as string | undefined;

    const query: any = {
      "participants.userId": userId,
    };

    if (cursor) {
      query.updatedAt = { $lt: new Date(cursor as string) };
    }

    const conversations = await Conversation.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit + 1)
      .populate("participants.userId", "profilePicture username");

    let nextCursor: string | null = null;

    if (conversations.length > limit) {
      const extraConversation = conversations.pop();
      nextCursor = extraConversation?.updatedAt.toISOString() || null;
    }

    res.status(200).json({
      data: conversations,
      pagination: {
        nextCursor,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const addParticipants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { conversationId, participants } = req.body;
    const userId = req.user?.id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      res.status(404).json({ message: "Conversation not found" });
      return;
    }

    const isAdmin = conversation.participants.some(
      (p: any) => p.userId.toString() === userId && p.role === "admin"
    );
    if (!isAdmin) {
      res.status(400).json({ message: "Only admins can add participants" });
      return;
    }

    participants.forEach((user: any) => {
      const alreadyExits = conversation.participants.some(
        (p: any) => p.userId.toString() === user.userId
      );

      if (alreadyExits) {
        res.status(400).json({ message: "User already add exists" });
        return;
      }

      if (!alreadyExits) {
        conversation.participants.push({
          userId: user.userId,
          role: "member",
          joinedAt: new Date(),
        });
      }
    });

    await conversation.save();

    res
      .status(200)
      .json({ message: "Participants added successfully", data: conversation });
  } catch (error) {
    next(error);
  }
};

export const removeParticipants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { conversationId, userId: removeUserId } = req.body;
    const userId = req.user?.id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      res.status(404).json({ message: "Conversation not found" });
      return;
    }

    const isAdmin = conversation.participants.some(
      (p: any) => p.userId.toString() === userId && p.role === "admin"
    );
    if (!isAdmin) {
      res.status(400).json({ message: "Only admins can remove participants" });
      return;
    }

    const participant = conversation.participants.find(
      (p: any) => p.userId.toString() !== removeUserId
    );
    if (!participant) {
      res
        .status(404)
        .json({ message: "Participant not found in the conversation" });
      return;
    }

    if (participant.role === "admin") {
      res
        .status(403)
        .json({ message: "You cannot remove admins from conversation" });
      return;
    }

    conversation.participants.filter(
      (p: any) => p.userId.toString() !== removeUserId
    );

    await conversation.save();

    res.status(200).json({
      message: "Participants removed successfully",
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

export const updateConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const conversationId = req.params.id;
    const userId = req.user?.id;
    const { name, description } = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      res.status(404).json({ message: "Conversation not found" });
      return;
    }

    const isAdmin = conversation.participants.find(
      (p) => p.userId.toString() === userId
    );
    if (!isAdmin) {
      res
        .status(403)
        .json({ message: "Unauthorized only admins can update conversation" });
      return;
    }

    if (name) conversation.name = name;
    if (description) conversation.descriptions = description;

    await conversation.save();
    res.status(200).json({
      message: "Conversation updated successfully",
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const conversationId = req.params.id;
    const userId = req.user?.id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      res.status(404).json({ message: "Conversation not found" });
      return;
    }

    const isAuthorized =
      conversation.createdBy.toString() === userId ||
      conversation.participants.some(
        (p) => p.userId.toString() === userId && p.role === "admin"
      );
    if (!isAuthorized) {
      res.status(403).json({
        message: "You are not authorized to delete this conversation",
      });
      return;
    }
    await conversation.deleteOne();

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    next(error);
  }
};
