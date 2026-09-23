import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applicationService } from "@/services/applicationService";
import { queryKeys } from "@/lib/queryKeys";

/** Employer's applicants across their jobs; filters: { jobId, status }. */
export function useApplications(filters, options = {}) {
  return useQuery({
    queryKey: queryKeys.applications.list(filters),
    queryFn: () => applicationService.list(filters),
    enabled: options.enabled ?? true,
  });
}

/** Seeker's own applications — powers the "My Applications" page. */
export function useMyApplications(options = {}) {
  return useQuery({
    queryKey: queryKeys.applications.mine,
    queryFn: applicationService.mine,
    enabled: options.enabled ?? true,
  });
}

/** Used by the Applications page's per-row status dropdown. */
export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => applicationService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
    },
  });
}
