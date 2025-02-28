import { z } from "zod";
import { UserStatus } from "../types/user";

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

export const UpdateUser = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers and underscores"
      )
      .optional(),

    email: z.string().email("Invalid email address").optional(),

    currentPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must contain at least one uppercase, lowercase, number and special character"
      )
      .optional(),

    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must contain at least one uppercase, lowercase, number and special character"
      )
      .optional(),

    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters")
      .optional(),

    profilePicture: z.string().url("Invalid avatar URL").optional(),
  })
  .refine((data) => {
    return Object.keys(data).length > 0;
  }, "At least one field must be provided for update");

export type TUpdateUserDTO = z.infer<typeof UpdateUser>;
