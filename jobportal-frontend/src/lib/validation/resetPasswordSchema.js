import { z } from "zod";
import { withMatchingPasswords } from "./withMatchingPasswords";

export const resetPasswordSchema = withMatchingPasswords(
  z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  }),
  "password",
  "confirmPassword",
);
