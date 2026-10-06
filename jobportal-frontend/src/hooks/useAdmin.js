import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/adminService";
import { queryKeys } from "@/lib/queryKeys";

export function useAdminDashboard() {
  return useQuery({
    queryKey: queryKeys.admin.dashboard,
    queryFn: adminService.getDashboard,
  });
}

/** filters: { search, role } — powers the Manage Users page. */
export function useAdminUsers(filters) {
  return useQuery({
    queryKey: queryKeys.admin.users.list(filters),
    queryFn: () => adminService.listUsers(filters),
  });
}

export function useToggleUserBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.toggleUserBlock,
    onSuccess: () => {
      // Prefix match — invalidates every filtered list() variant too,
      // not just whichever filters happened to be active when this ran.
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all });
    },
  });
}

/** filters: { search, status } — powers the admin Jobs page. */
export function useAdminJobs(filters) {
  return useQuery({
    queryKey: queryKeys.admin.jobs.list(filters),
    queryFn: () => adminService.listJobs(filters),
  });
}

export function useAdminDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.jobs.all });
    },
  });
}