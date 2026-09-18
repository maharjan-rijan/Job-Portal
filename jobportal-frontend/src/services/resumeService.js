import api from "@/lib/axios";

export const resumeService = {
  getMine: () => api.get("/resumes/me").then((r) => r.data),
  save: (payload) => api.put("/resumes/me", payload).then((r) => r.data),
};
