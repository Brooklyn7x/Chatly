import { z } from "zod";
export const UpdateConversationSchema = z.object({
  metadata: z
    .object({
      title: z.string().min(1).max(50).optional(),
      description: z.string().max(200).optional(),
      avatar: z.string().url().optional(),
      isArchived: z.boolean().optional(),
      isPinned: z.boolean().optional(),
    })
    .optional(),
  participants: z
    .array(
      z.object({
        action: z.enum(["add", "remove", "updateRole"]),
        userId: z.string().min(1),
        // role: z.nativeEnum(["zasas", ""]).optional(),
      })
    )
    .optional(),
});

export type UpdateConversationDTO = z.infer<typeof UpdateConversationSchema>;
