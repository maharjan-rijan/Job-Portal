import { Outlet } from "react-router-dom";
import { LayoutDashboard, Briefcase, Users, FilePlus, UserCircle, Lock } from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardTopbar } from "@/components/layout/DashboardTopbar";

const EMPLOYER_NAV = [
  { label: "Dashboard", to: "/employer/dashboard", icon: LayoutDashboard },
  { label: "Manage Jobs", to: "/employer/jobs", icon: Briefcase },
  { label: "Post a Job", to: "/employer/jobs/new", icon: FilePlus },
  { label: "Applications", to: "/employer/applications", icon: Users },
  { label: "Account", to: "/employer/account", icon: UserCircle },
  { label: "Change Password", to: "/employer/change-password", icon: Lock },
];

export function EmployerLayout() {
  return (
    <div className="flex min-h-screen bg-ink-50">
      <DashboardSidebar items={EMPLOYER_NAV} />
      <div className="flex flex-1 flex-col">
        <DashboardTopbar title="Employer Dashboard" />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
