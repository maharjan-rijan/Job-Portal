import { MOCK_BLOG_POSTS } from "@/lib/mockData";

// There's no blog API yet, so this reads from the local mock data — but
// it's shaped and called exactly like every other service (async,
// filters object, throws on "not found"), so swapping the two lines
// below for real `api.get(...)` calls later won't touch any component.

function matches(post, { q, category } = {}) {
  const keyword = q?.trim().toLowerCase();
  const matchesKeyword =
    !keyword ||
    post.title.toLowerCase().includes(keyword) ||
    post.excerpt.toLowerCase().includes(keyword);
  const matchesCategory = !category || post.category === category;
  return matchesKeyword && matchesCategory;
}

export const blogService = {
  list: (filters) =>
    Promise.resolve(MOCK_BLOG_POSTS.filter((post) => matches(post, filters))),

  getById: (id) => {
    const post = MOCK_BLOG_POSTS.find((item) => item.id === id);
    if (!post) {
      return Promise.reject(new Error("Post not found"));
    }
    return Promise.resolve(post);
  },

  categories: () =>
    Promise.resolve([...new Set(MOCK_BLOG_POSTS.map((post) => post.category))]),
};