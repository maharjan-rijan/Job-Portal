import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().min(3, "Enter a job title"),
  type: z.string().min(1, "Choose a job type"),
  location: z.string().min(2, "Enter a location"),
  salaryMin: z.coerce.number().min(0, "Enter a minimum salary").optional(),
  salaryMax: z.coerce.number().min(0, "Enter a maximum salary").optional(),
  vacancies: z.coerce.number().min(1, "Enter at least 1 vacancy"),
  experienceLevel: z.string().min(1, "Enter an experience level"),
  applicationDeadline: z.string().min(1, "Choose a deadline"),
  description: z.string().min(20, "Description should be at least 20 characters"),
  responsibilities: z.string().optional(),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
});
