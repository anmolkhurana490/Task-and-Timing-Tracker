import { z } from "zod";

/** Client-side rules kept in sync with the backend auth validation. */
export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string()
    .min(8, "Password must be at least 8 characters."),
});

export const signupSchema = z.object({
  name: z.string().trim()
    .min(1, "Name is required.")
    .max(100, "Name is too long."),

  email: z.email("Enter a valid email address."),
  
  password: z.string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password is too long."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;