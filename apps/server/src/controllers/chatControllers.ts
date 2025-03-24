import { Request, Response } from "express";
import * as chatService from "../services/chatServices";

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const messages = await chatService.getMessagesByChatId(chatId);
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
