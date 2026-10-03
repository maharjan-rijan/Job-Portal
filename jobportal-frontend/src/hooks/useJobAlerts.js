import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jobAlertService } from "@/services/jobAlertService";
import { queryKeys } from "@/lib/queryKeys";

/** The logged-in seeker's job alerts — powers the Job Alerts page. */
export function useJobAlerts() {
  return useQuery({
    queryKey: queryKeys.jobAlerts.all,
    queryFn: jobAlertService.list,
  });
}

export function useCreateJobAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobAlertService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobAlerts.all });
    },
  });
}

export function useDeleteJobAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobAlertService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobAlerts.all });
    },
  });
}