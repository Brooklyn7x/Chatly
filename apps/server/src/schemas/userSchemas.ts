import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    username: z.string().optional(),
    email: z.string().email({ message: "Must be a valid email" }).optional(),
  }),
});

export const addContactSchema = z.object({
  body: z.object({
    id: z.string().min(1, { message: "Contact ID is required" }),
  }),
});

export const searchUsersSchema = z.object({
  query: z.object({
    search: z.string().min(1, { message: "Search query is required" }),
  }),
});
