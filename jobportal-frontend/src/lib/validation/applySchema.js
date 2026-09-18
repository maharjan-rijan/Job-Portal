import { z } from "zod";

export const applySchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  resumeUrl: z
    .string()
    .url("Enter a link to your resume (Google Drive, portfolio, etc.)"),
  coverNote: z
    .string()
    .max(500, "Keep your note under 500 characters")
    .optional(),
});
