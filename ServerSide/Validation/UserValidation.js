import { z } from "zod";



export const loginSchema = z.object({
  email: z.string().trim().max(50)
    .email({ message: "Please provide a valid email address" }),

  password: z.string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" })
});

export const registerSchema = loginSchema.extend({
  username: z.string()
  .trim()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(30, { message: "Username must be at most 30 characters long" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" })
    .refine((val) => !/\s/.test(val), { message: "Username cannot contain spaces" }),
});