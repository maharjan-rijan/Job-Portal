import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Enter your current password"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });
