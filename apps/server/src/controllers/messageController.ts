import { NextFunction, Request, Response } from "express";
import Message from "../models/message";
import Conversation from "../models/conversation";
export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user?.id;
    const { limit, cursor } = req.query;

    if (!userId) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      res.status(404).json({ message: "Conversation not found" });
      return;
    }
    const isParticipant = conversation.participants.find(
      (p: any) => p.userId.toString() === userId
    );
    if (!isParticipant) {
      res
        .status(403)
        .json({ message: "You are not part of this conversation" });
      return;
    }

    const limitNumber = parseInt(limit as string, 10);

    const query: any = { conversationId };
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor as string) };
    }

    const messagesQuery = await Message.find(query)
      .populate("senderId", "username profilePicture")
      .sort({ createdAt: - 1 })
      .limit(limitNumber + 1);

    let nextCursor: string | null = null;

    if (messagesQuery.length > limitNumber) {
      const extraMessage = messagesQuery.pop();
      nextCursor =
        extraMessage && extraMessage.createdAt
          ? extraMessage.createdAt.toISOString()
          : null;
    } else {
      nextCursor = null;
    }

    res.status(200).json({
      messages: messagesQuery,
      pagination: {
        nextCursor,
        limit: limitNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};
