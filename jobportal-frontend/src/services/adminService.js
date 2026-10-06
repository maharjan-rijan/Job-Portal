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
    status: job.status ?? "Open",
    postedAt: field(job, "created_at", "postedAt"),
    applicantsCount: job.applicants_count ?? 0,
    // Who posted it — the employer's contact name and/or company name,
    // whichever your table should show (ManageUsers-style "creator" column).
    creatorName: job.employer?.name ?? "—",
    companyName: job.employer?.company?.name ?? null,
  };
}

export const adminService = {
  getDashboard: () => api.get("/admin/dashboard").then((r) => r.data),

  /** filters: { search, role } — both optional. */
  listUsers: (filters) =>
    api.get("/admin/users", { params: filters }).then((r) => {
      const raw = Array.isArray(r.data) ? r.data : r.data.data ?? [];
      return raw.map(normalizeUser);
    }),

  /** Toggles a user between active and blocked. */
  toggleUserBlock: (id) =>
    api.patch(`/admin/users/${id}/toggle-block`).then((r) => normalizeUser(r.data)),

  /** filters: { search, status } — both optional. */
  listJobs: (filters) =>
    api.get("/admin/jobs", { params: filters }).then((r) => {
      const raw = Array.isArray(r.data) ? r.data : r.data.data ?? [];
      return raw.map(normalizeAdminJob);
    }),

  deleteJob: (id) => api.delete(`/admin/jobs/${id}`).then((r) => r.data),
};