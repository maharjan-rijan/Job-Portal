import api from "@/lib/axios";
import { field } from "@/utils/normalize";

function normalizeUser(user) {
  if (!user) return user;

  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    role: user.role,
    companyName: user.company?.name ?? null,
    createdAt: field(user, "created_at", "createdAt"),
    isBlocked: Boolean(field(user, "is_blocked", "isBlocked", false)),
  };
}

function normalizeAdminJob(job) {
  if (!job) return job;

  return {
    id: String(job.id),
    title: job.title,
    type: job.type,
    location: job.location,

    // Job status
    status: job.status ?? "Open",

    // Featured status
    isFeatured: Boolean(field(job, "is_featured", "isFeatured", false)),

    // Dates
    postedAt: field(job, "created_at", "postedAt"),

    // Applicants
    applicantsCount: job.applicants_count ?? job.applicantsCount ?? 0,

    // Employer / creator
    creatorName: job.employer?.name ?? job.creator?.name ?? "—",

    companyName: job.employer?.company?.name ?? job.company?.name ?? null,
  };
}

export const adminService = {
  // ============================================================
  // DASHBOARD
  // ============================================================

  getDashboard: () => api.get("/admin/dashboard").then((r) => r.data),

  // ============================================================
  // USERS
  // ============================================================

  /**
   * Filters:
   * {
   *   search,
   *   role
   * }
   */
  listUsers: (filters) =>
    api.get("/admin/users", { params: filters }).then((r) => {
      const raw = Array.isArray(r.data) ? r.data : (r.data.data ?? []);

      return raw.map(normalizeUser);
    }),

  /**
   * Toggle user:
   * Active <-> Blocked
   */
  toggleUserBlock: (id) =>
    api
      .patch(`/admin/users/${id}/toggle-block`)
      .then((r) => normalizeUser(r.data)),

  // ============================================================
  // JOBS
  // ============================================================

  /**
   * Filters:
   * {
   *   search,
   *   status
   * }
   */
  listJobs: (filters) =>
    api.get("/admin/jobs", { params: filters }).then((r) => {
      const raw = Array.isArray(r.data) ? r.data : (r.data.data ?? []);

      return raw.map(normalizeAdminJob);
    }),

  /**
   * Toggle job status:
   * Open <-> Closed
   */
  toggleJobStatus: (id) =>
    api
      .patch(`/admin/jobs/${id}/toggle-status`)
      .then((r) => normalizeAdminJob(r.data)),

  /**
   * Toggle featured:
   * Yes <-> No
   */
  toggleJobFeatured: (id) =>
    api
      .patch(`/admin/jobs/${id}/toggle-featured`)
      .then((r) => normalizeAdminJob(r.data)),

  /**
   * Delete job
   */
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`).then((r) => r.data),
};
