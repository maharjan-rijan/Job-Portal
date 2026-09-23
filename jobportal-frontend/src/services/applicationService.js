import api from "@/lib/axios";
import { field } from "@/utils/normalize";

function normalizeApplication(app) {
  if (!app) return app;
  return {
    id: String(app.id),
    jobId: field(app, "job_id", "jobId"),
    jobTitle: app.job?.title ?? app.jobTitle ?? "—",
    company: app.job?.employer?.company?.name ?? app.job?.employer?.name ?? null,
    name: field(app, "full_name", "name", "—"),
    email: app.email ?? "—",
    resumeUrl: field(app, "resume_url", "resumeUrl"),
    coverNote: field(app, "cover_note", "coverNote", ""),
    status: app.status ?? "applied",
    appliedAt: field(app, "created_at", "appliedAt"),
  };
}

export const applicationService = {
  list: (params) =>
    api.get("/applications", { params }).then((r) => {
      const raw = Array.isArray(r.data) ? r.data : r.data.data ?? [];
      return raw.map(normalizeApplication);
    }),

  /** Seeker-only: the applications the current user has submitted. */
  mine: () =>
    api.get("/applications/mine").then((r) => {
      const raw = Array.isArray(r.data) ? r.data : r.data.data ?? [];
      return raw.map(normalizeApplication);
    }),

  applyToJob: (jobId, payload) =>
    api.post(`/jobs/${jobId}/applications`, payload).then((r) => r.data),

  updateStatus: (applicationId, status) =>
    api
      .patch(`/applications/${applicationId}/status`, { status })
      .then((r) => normalizeApplication(r.data)),
};
