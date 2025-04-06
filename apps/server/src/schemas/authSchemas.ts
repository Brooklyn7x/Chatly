import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    username: z.string({ required_error: "Username is required" }),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Please provide a valid email address" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" }),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Please provide a valid email address" }),
    password: z.string({ required_error: "Password is required" }),
  }),
});
