import { z } from "zod";

export const createConversationSchema = z.object({
  type: z.enum(["private", "group", "channel"], {
    required_error: "Conversation type is required",
  }),
  participants: z
    .array(
      z.object({
        userId: z
          .string()
          .min(1, { message: "Participant userId is required" }),
        role: z.string().optional(),
      })
    )
    .min(1, { message: "At least one participant is required" }),
  name: z.string().optional(),
  description: z.string().optional(),
});

export const addParticipantsSchema = z.object({
  conversationId: z.string().min(1, { message: "Conversation ID is required" }),
  participants: z
    .array(
      z.object({
        userId: z
          .string()
          .min(1, { message: "Participant userId is required" }),
      })
    )
    .min(1, { message: "At least one participant must be provided" }),
});

export const removeParticipantsSchema = z.object({
  conversationId: z.string().min(1, { message: "Conversation ID is required" }),
  userId: z.string().min(1, { message: "User ID is required" }),
});

export const updateConversationSchema = z.object({
  conversationId: z.string().min(1, { message: "Conversation ID is required" }),
  name: z.string().optional(),
  description: z.string().optional(),
});

export const deleteConversationSchema = z.object({
  conversationId: z.string().min(1, { message: "Conversation ID is required" }),
});
