import { z } from "zod";
import { withMatchingPasswords } from "./withMatchingPasswords";

export const changePasswordSchema = withMatchingPasswords(
  z.object({
    currentPassword: z.string().min(6, "Enter your current password"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmNewPassword: z.string(),
  }),
  "newPassword",
  "confirmNewPassword",
);
