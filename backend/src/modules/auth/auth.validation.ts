import { z } from "zod";

/** Validates the fields required to create an account. */
export const registerSchema = z.object({
  email: z.email(),
  name: z.string().trim().min(1).max(100),
  password: z.string().min(8).max(72),
});

/** Validates the fields required to sign in. */
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(72),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;