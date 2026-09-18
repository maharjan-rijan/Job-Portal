import { Outlet } from "react-router-dom";
import { LayoutDashboard, FileText, Bell, Search, UserCircle, Lock } from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardTopbar } from "@/components/layout/DashboardTopbar";

const SEEKER_NAV = [
  { label: "Dashboard", to: "/seeker/dashboard", icon: LayoutDashboard },
  { label: "Browse Jobs", to: "/seeker/browse-jobs", icon: Search },
  { label: "My Resume", to: "/seeker/resume", icon: FileText },
  { label: "Job Alerts", to: "/seeker/job-alerts", icon: Bell },
  { label: "Account", to: "/seeker/account", icon: UserCircle },
  { label: "Change Password", to: "/seeker/change-password", icon: Lock },
];

export function SeekerLayout() {
  return (
    <div className="flex min-h-screen bg-ink-50">
      <DashboardSidebar items={SEEKER_NAV} />
      <div className="flex flex-1 flex-col">
        <DashboardTopbar title="Job Seeker Dashboard" />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
