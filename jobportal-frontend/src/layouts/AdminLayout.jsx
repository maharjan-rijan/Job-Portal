import { Outlet } from "react-router-dom";
import { LayoutDashboard, Users, Briefcase, FileBarChart } from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardTopbar } from "@/components/layout/DashboardTopbar";

const ADMIN_NAV = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Jobs", to: "/admin/jobs", icon: Briefcase },
  { label: "Reports", to: "/admin/reports", icon: FileBarChart },
];

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-ink-50">
      <DashboardSidebar items={ADMIN_NAV} />
      <div className="flex flex-1 flex-col">
        <DashboardTopbar title="Admin Dashboard" />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
