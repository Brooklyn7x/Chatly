import { z } from "zod";
import { UserStatus } from "../types/user.types";

export const userValidation = {
  updateProfile: z.object({
    username: z.string().min(3).max(30).optional(),
    email: z.string().email().optional(),
    bio: z.string().max(500).optional(),
  }),

  searchUsers: z.object({
    query: z.string().min(1),
    filter: z.string().optional(),
    page: z.number().positive().optional(),
    limit: z.number().positive().max(50).optional(),
  }),

  updateStatus: z.object({
    status: z.enum([UserStatus.ONLINE, UserStatus.OFFLINE, UserStatus.AWAY]),
  }),
};
