import api from "@/lib/axios";
import { field } from "@/utils/normalize";

/**
 * The backend returns snake_case DB columns and nests company info under
 * employer.company; this adapts that shape into what the UI already
 * expects (camelCase, flat company/companyWebsite). Keeping the mapping
 * here means components never need to know the wire format changed.
 */
export function normalizeJob(job) {
  if (!job) return job;
  return {
    id: String(job.id),
    title: job.title,
    type: job.type,
    location: job.location,
    salaryMin: field(job, "salary_min", "salaryMin"),
    salaryMax: field(job, "salary_max", "salaryMax"),
    vacancies: job.vacancies,
    experienceLevel: field(job, "experience_level", "experienceLevel"),
    applicationDeadline: field(job, "application_deadline", "applicationDeadline"),
    description: job.description,
    responsibilities: job.responsibilities ?? [],
    requirements: job.requirements ?? [],
    benefits: job.benefits ?? [],
    status: job.status ?? "Open",
    postedAt: field(job, "created_at", "postedAt"),
    employerId: job.employer_id != null ? String(job.employer_id) : job.employer?.id != null ? String(job.employer.id) : null,
    company: job.employer?.company?.name ?? job.employer?.name ?? "—",
    companyWebsite: job.employer?.company?.website ?? "",
    applicantsCount: job.applicants_count ?? 0,
  };
}

export const jobService = {
  list: (params) =>
    api.get("/jobs", { params }).then((r) => ({
      data: (r.data.data ?? []).map(normalizeJob),
      meta: r.data.meta ?? null,
    })),

  getById: (id) => api.get(`/jobs/${id}`).then((r) => normalizeJob(r.data)),

  mine: () => api.get("/jobs/mine").then((r) => r.data.map(normalizeJob)),

  create: (payload) => api.post("/jobs", payload).then((r) => normalizeJob(r.data)),

  update: (id, payload) =>
    api.put(`/jobs/${id}`, payload).then((r) => normalizeJob(r.data)),

  remove: (id) => api.delete(`/jobs/${id}`).then((r) => r.data),

  categories: () => api.get("/jobs/categories").then((r) => r.data),
};
