import { z } from "zod";

/** Today as YYYY-MM-DD in the user's own timezone (what <input type="date"> uses). */
export function todayISO() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

const optionalSalary = (message) =>
  z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? null : Number(v)),
    z.number({ invalid_type_error: message }).min(0, message).nullable()
  );


export function buildJobSchema({ originalDeadline } = {}) {
  return z
    .object({
      title: z.string().min(3, "Enter a job title"),
      type: z.string().min(1, "Choose a job type"),
      location: z.string().min(2, "Enter a location"),
      salaryMin: optionalSalary("Minimum salary can't be negative"),
      salaryMax: optionalSalary("Maximum salary can't be negative"),
      vacancies: z.coerce.number().min(1, "Enter at least 1 vacancy"),
      experienceLevel: z.string().min(1, "Enter an experience level"),
      applicationDeadline: z
        .string()
        .min(1, "Choose a deadline")
        .refine((value) => value >= todayISO() || value === originalDeadline, {
          message: "Deadline can't be before today's date",
        }),
      description: z.string().min(20, "Description should be at least 20 characters"),
      responsibilities: z.string().optional(),
      requirements: z.string().optional(),
      benefits: z.string().optional(),
    })
    .refine(
      (data) =>
        data.salaryMin === null || data.salaryMax === null || data.salaryMax >= data.salaryMin,
      {
        message: "Max salary can't be less than min salary",
        path: ["salaryMax"],
      }
    );
}

export const jobSchema = buildJobSchema();