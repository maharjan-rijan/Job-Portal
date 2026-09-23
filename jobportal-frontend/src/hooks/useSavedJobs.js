import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { savedJobService } from "@/services/savedJobService";
import { queryKeys } from "@/lib/queryKeys";

/** The seeker's saved jobs — powers the "Saved Jobs" page. */
export function useSavedJobs(options = {}) {
  return useQuery({
    queryKey: queryKeys.savedJobs.all,
    queryFn: savedJobService.list,
    enabled: options.enabled ?? true,
  });
}

/** Used by the heart/"Save job" button on the job details page. */
export function useToggleSavedJob() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.savedJobs.all });

  const save = useMutation({
    mutationFn: (jobId) => savedJobService.save(jobId),
    onSuccess: invalidate,
  });

  const unsave = useMutation({
    mutationFn: (jobId) => savedJobService.unsave(jobId),
    onSuccess: invalidate,
  });

  return { save, unsave };
}
