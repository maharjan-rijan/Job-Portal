import { z } from "zod";
import { withMatchingPasswords } from "./withMatchingPasswords";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = withMatchingPasswords(
  z.object({
    name: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["seeker", "employer"]),
    companyName: z.string().optional(),
  }),
  "password",
  "confirmPassword",
).refine(
  (data) => data.role !== "employer" || (data.companyName?.trim().length ?? 0) >= 2,
  { message: "Enter your company name", path: ["companyName"] }
);
