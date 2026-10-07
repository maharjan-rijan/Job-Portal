import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

/** Admin-only: used by the "Write a post" / "Edit post" forms. */
export function useSaveBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) =>
      id ? blogService.update(id, payload) : blogService.create(payload),
    onSuccess: () => {
      // Prefix match — ["blog"] covers list(), detail() and the
      // categories query all at once.
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.all });
    },
  });
}

/** Admin-only: used by the Manage Blog page's delete action. */
export function useDeleteBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.all });
    },
  });
}