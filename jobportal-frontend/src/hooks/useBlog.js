import { useQuery } from "@tanstack/react-query";
import { blogService } from "@/services/blogService";
import { queryKeys } from "@/lib/queryKeys";

export function useBlogPosts(filters, options = {}) {
  return useQuery({
    queryKey: queryKeys.blog.list(filters),
    queryFn: () => blogService.list(filters),
    enabled: options.enabled ?? true,
  });
}

export function useBlogPost(id) {
  return useQuery({
    queryKey: queryKeys.blog.detail(id),
    queryFn: () => blogService.getById(id),
    enabled: Boolean(id),
    retry: false, // a bad slug should hit NotFound immediately, not retry 3x
  });
}

export function useBlogCategories() {
  return useQuery({
    queryKey: queryKeys.blog.all,
    queryFn: blogService.categories,
  });
}