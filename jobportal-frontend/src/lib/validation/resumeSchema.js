import { z } from "zod";

export const resumeSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email address"),
  title: z.string().min(2, "Enter a professional title"),
  location: z.string().min(2, "Enter your location"),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  expectedSalary: z.string().optional(),

  degree: z.string().min(2, "Enter your degree"),
  fieldOfStudy: z.string().min(2, "Enter your field of study"),
  school: z.string().min(2, "Enter your school"),
  educationFrom: z.string().min(4, "Enter a start year"),
  educationTo: z.string().min(4, "Enter an end year"),
  educationDescription: z.string().optional(),

  companyName: z.string().min(2, "Enter a company name"),
  jobTitle: z.string().min(2, "Enter your job title"),
  experienceFrom: z.string().min(4, "Enter a start year"),
  experienceTo: z.string().min(4, "Enter an end year"),
  experienceDescription: z.string().optional(),
});
