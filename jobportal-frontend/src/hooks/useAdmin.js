import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/adminService";
import { queryKeys } from "@/lib/queryKeys";

export function useAdminDashboard() {
  return useQuery({
    queryKey: queryKeys.admin.dashboard,
    queryFn: adminService.getDashboard,
  });
}
