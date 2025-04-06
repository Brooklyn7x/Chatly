import { z } from "zod";

export const getMessagesSchema = z.object({
  params: z.object({
    conversationId: z
      .string()
      .min(1, { message: "Conversation ID is required" }),
  }),
  query: z.object({
    limit: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(Number(val)), {
        message: "Limit must be a number",
      }),
    cursor: z.string().optional(),
  }),
});

export const messageSentSchema = z.object({
  conversationId: z.string().min(1, { message: "Conversation ID is required" }),
  type: z.string().min(1, { message: "Message type is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  tempId: z.string().optional(),
  attachment: z.string().optional(),
});

export const messageEditSchema = z.object({
  messageId: z.string().min(1, { message: "Message ID is required" }),
  content: z.string().min(1, { message: "Content is required" }),
});

export const messageDeleteSchema = z.string().min(1, {
  message: "Message ID is required",
});

export const markAsReadSchema = z.object({
  chatId: z.string().min(1, { message: "Chat ID is required" }),
  messageId: z.string().min(1, { message: "Message ID is required" }),
});

export const markAllReadSchema = z.object({
  chatId: z.string().min(1, { message: "Chat ID is required" }),
});
