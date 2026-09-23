import api from "@/lib/axios";
import { normalizeJob } from "@/services/jobService";

export const savedJobService = {
  list: () => api.get("/saved-jobs").then((r) => r.data.map(normalizeJob)),

  save: (jobId) => api.post(`/saved-jobs/${jobId}`).then((r) => r.data),

  unsave: (jobId) => api.delete(`/saved-jobs/${jobId}`).then((r) => r.data),
};
