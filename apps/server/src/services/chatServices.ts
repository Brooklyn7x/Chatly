import { MessageModel } from "../models/message";

export const getMessagesByChatId = async (chatId: string) => {
  try {
    const message = await MessageModel.find({ id: chatId }).sort({
      createdAt: -1,
    });
    return message;
  } catch (error) {
    throw new Error("Error fetching messages");
  }
};

export const createMessage = async (
  chatId: string,
  senderId: string,
  content: string
) => {
  try {
    const message = new MessageModel({
      chatId,
      senderId,
      content,
      createdAt: new Date(),
    });
    await message.save();
    return message;
  } catch (error) {
    throw new Error("Error creating message");
  }
};
