import { z } from "zod";

const educationEntrySchema = z.object({
  degree: z.string().min(2, "Enter a degree"),
  fieldOfStudy: z.string().min(2, "Enter a field of study"),
  school: z.string().min(2, "Enter a school"),
  from: z.string().min(4, "Enter a start year"),
  to: z.string().min(4, "Enter an end year, or 'Present'"),
  description: z.string().optional(),
});

const experienceEntrySchema = z.object({
  companyName: z.string().min(2, "Enter a company name"),
  jobTitle: z.string().min(2, "Enter a job title"),
  from: z.string().min(4, "Enter a start year"),
  to: z.string().min(4, "Enter an end year, or 'Present'"),
  description: z.string().optional(),
});

const socialLinkEntrySchema = z.object({
  platform: z.string().min(1, "Choose a platform"),
  url: z.string().url("Enter a full URL"),
});

const achievementEntrySchema = z.object({
  title: z.string().min(2, "Enter a title"),
  issuer: z.string().optional(),
  date: z.string().optional(),
  description: z.string().optional(),
});

export const resumeSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email address"),
  title: z.string().min(2, "Enter a professional title"),
  location: z.string().min(2, "Enter your location"),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  expectedSalary: z.string().optional(),

  education: z.array(educationEntrySchema).min(1, "Add at least one education entry"),
  experience: z.array(experienceEntrySchema).optional(),
  socialLinks: z.array(socialLinkEntrySchema).optional(),
  achievements: z.array(achievementEntrySchema).optional(),
});

// Blank rows used when the user clicks "Add" on each section.
export const BLANK_EDUCATION_ENTRY = {
  degree: "", fieldOfStudy: "", school: "", from: "", to: "", description: "",
};
export const BLANK_EXPERIENCE_ENTRY = {
  companyName: "", jobTitle: "", from: "", to: "", description: "",
};
export const BLANK_SOCIAL_LINK_ENTRY = { platform: "", url: "" };
export const BLANK_ACHIEVEMENT_ENTRY = { title: "", issuer: "", date: "", description: "" };
