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
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.mine });
    },
  });
}

/** Employer's own jobs — powers the Manage Jobs page. */
export function useMyJobs(options = {}) {
  return useQuery({
    queryKey: queryKeys.jobs.mine,
    queryFn: jobService.mine,
    enabled: options.enabled ?? true,
  });
}

/**
 * "Recommended for you" — ML-matched jobs for the logged-in seeker
 * (see JobRecommendationController). Disabled by default so an
 * employer/admin viewing a shared component never fires it.
 */
export function useRecommendedJobs(options = {}) {
  return useQuery({
    queryKey: queryKeys.jobs.recommended,
    queryFn: jobService.recommended,
    enabled: options.enabled ?? false,
  });
}

/** Used by Manage Jobs' delete action. */
export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => jobService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.mine });
    },
  });
}
