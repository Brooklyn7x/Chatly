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
    const { page = 1, limit = 20 } = req.query;

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
      (p) => p.userId.toString() === userId
    );
    if (!isParticipant) {
      res
        .status(403)
        .json({ message: "You are not part of this conversation" });
      return;
    }

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const messages = await Message.find({ conversationId })
      .populate("senderId", "username, profilePicture")
      .sort({
        timestamp: -1,
      })
      .skip(skip)
      .limit(limitNumber);

    const totalMessages = await Message.countDocuments({ conversationId });
    res.status(200).json({
      messages,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalMessages / limitNumber),
        totalMessages,
      },
    });
  } catch (error) {
    next(error);
  }
};
