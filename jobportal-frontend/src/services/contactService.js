import api from "@/lib/axios";

export const contactService = {
  send: (payload) => api.post("/contact", payload).then((r) => r.data),
};
