import api from "@/lib/axios";

function normalizeAlert(alert) {
  if (!alert) return alert;
  return {
    id: String(alert.id),
    name: alert.name,
    keywords: alert.keywords,
    type: alert.type,
    frequency: alert.frequency,
  };
}

export const jobAlertService = {
  /** The logged-in seeker's own job alerts. */
  list: () =>
    api.get("/job-alerts").then((r) => {
      const raw = Array.isArray(r.data) ? r.data : r.data.data ?? [];
      return raw.map(normalizeAlert);
    }),

  create: (payload) => api.post("/job-alerts", payload).then((r) => normalizeAlert(r.data)),

  remove: (id) => api.delete(`/job-alerts/${id}`).then((r) => r.data),
};