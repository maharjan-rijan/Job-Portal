import api from "@/lib/axios";

export const adminService = {
  getDashboard: () => api.get("/admin/dashboard").then((r) => r.data),
};
