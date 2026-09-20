import api from "@/lib/axios";

function normalizeApplication(app) {
  if (!app) return app;
  return {
    id: String(app.id),
    jobId: app.job_id ?? app.jobId,
    jobTitle: app.job?.title ?? app.jobTitle ?? "—",
    name: app.full_name ?? app.name ?? "—",
    email: app.email ?? "—",
    resumeUrl: app.resume_url ?? app.resumeUrl ?? null,
    coverNote: app.cover_note ?? app.coverNote ?? "",
    status: app.status ?? "applied",
    appliedAt: app.created_at ?? app.appliedAt ?? null,
  };
}

export const applicationService = {
  list: (params) =>
    api.get("/applications", { params }).then((r) => {
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
