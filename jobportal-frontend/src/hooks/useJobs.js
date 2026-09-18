import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jobService } from "@/services/jobService";
import { queryKeys } from "@/lib/queryKeys";

/** List/browse jobs, optionally filtered (keyword, location, category...). */
export function useJobs(filters) {
  return useQuery({
    queryKey: queryKeys.jobs.list(filters),
    queryFn: () => jobService.list(filters),
  });
}

export function useJob(id) {
  return useQuery({
    queryKey: queryKeys.jobs.detail(id),
    queryFn: () => jobService.getById(id),
    enabled: Boolean(id),
  });
}

/** Used by the employer "Post a Job" / "Edit Job" forms. */
export function useSaveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) =>
      id ? jobService.update(id, payload) : jobService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
    },
  });
}
