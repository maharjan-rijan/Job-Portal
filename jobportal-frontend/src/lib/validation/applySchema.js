import { z } from "zod";

export const applySchema = z
  .object({
    fullName: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email address"),
    resumeUrl: z
      .string()
      .url("Enter a valid link, e.g. https://drive.google.com/...")
      .optional()
      .or(z.literal("")),
    // Populated via setValue() from the FileUpload's onChange, not register() —
    // see ApplyForm.jsx. instanceof(File) so a real browser File passes and
    // undefined/"" doesn't.
    resumeFile: z.instanceof(File).optional(),
    coverNote: z
      .string()
      .max(500, "Keep your note under 500 characters")
      .optional(),
  })
  .refine((data) => Boolean(data.resumeUrl) || data.resumeFile instanceof File, {
    message: "Upload a resume file or paste a link to your resume",
    path: ["resumeFile"],
  });