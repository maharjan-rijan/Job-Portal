import api from "@/lib/axios";
import { field } from "@/utils/normalize";

function normalizeBlogPost(post) {
  if (!post) return post;
  return {
    id: String(post.id),
    title: post.title,
    category: post.category,
    author: post.author,
    publishedAt: field(post, "published_at", "publishedAt"),
    excerpt: post.excerpt,
    content: post.content,
  };
}

export const blogService = {
  list: (filters) =>
    api.get("/blog", { params: filters }).then((r) => {
      const raw = Array.isArray(r.data) ? r.data : r.data.data ?? [];
      return raw.map(normalizeBlogPost);
    }),

  getById: (id) => api.get(`/blog/${id}`).then((r) => normalizeBlogPost(r.data)),

  categories: () => api.get("/blog/categories").then((r) => r.data),

  /** Admin-only: create/update/delete a post. */
  create: (payload) => api.post("/blog", payload).then((r) => normalizeBlogPost(r.data)),

  update: (id, payload) =>
    api.put(`/blog/${id}`, payload).then((r) => normalizeBlogPost(r.data)),

  remove: (id) => api.delete(`/blog/${id}`).then((r) => r.data),
};