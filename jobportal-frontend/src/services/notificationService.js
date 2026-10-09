import api from "@/lib/axios";

function normalizeNotification(n) {
  if (!n) return n;
  return {
    id: String(n.id),
    type: n.type,
    data: n.data ?? {},
    readAt: n.read_at ?? n.readAt ?? null,
    createdAt: n.created_at ?? n.createdAt,
  };
}

export const notificationService = {
  list: () => api.get("/notifications").then((r) => (r.data ?? []).map(normalizeNotification)),

  unreadCount: () => api.get("/notifications/unread-count").then((r) => r.data?.count ?? 0),

  markRead: (id) =>
    api.patch(`/notifications/${id}/read`).then((r) => normalizeNotification(r.data)),

  markAllRead: () => api.patch("/notifications/read-all").then((r) => r.data),
};
