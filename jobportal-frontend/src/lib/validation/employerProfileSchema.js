import { z } from "zod";

export const employerProfileSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  companyName: z.string().min(2, "Enter your company name"),
  website: z
    .string()
    .url("Enter a full URL, e.g. https://acme.com")
    .optional()
    .or(z.literal("")),
  industry: z.string().optional(),
  location: z.string().optional(),
  description: z
    .string()
    .max(1000, "Keep the company description under 1000 characters")
    .optional(),
});
