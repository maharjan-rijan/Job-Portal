import api from "@/lib/axios";

export const applicationService = {
  list: (params) => api.get("/applications", { params }).then((r) => r.data),

  applyToJob: (jobId, payload) =>
    api.post(`/jobs/${jobId}/applications`, payload).then((r) => r.data),

  updateStatus: (applicationId, status) =>
    api
      .patch(`/applications/${applicationId}/status`, { status })
      .then((r) => r.data),
};
