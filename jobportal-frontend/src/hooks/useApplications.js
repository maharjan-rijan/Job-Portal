import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applicationService } from "@/services/applicationService";
import { queryKeys } from "@/lib/queryKeys";

/** Employer's applicants across their jobs; filters: { jobId, status }. */
export function useApplications(filters) {
  return useQuery({
    queryKey: queryKeys.applications.list(filters),
    queryFn: () => applicationService.list(filters),
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
