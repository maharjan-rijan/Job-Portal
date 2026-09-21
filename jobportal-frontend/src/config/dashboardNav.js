import {
  LayoutDashboard,
  Search,
  FileText,
  Bell,
  UserCircle,
  Lock,
  BriefcaseBusiness,
  Briefcase,
  FilePlus,
  Users,
  FileBarChart,
} from "lucide-react";
import { USER_ROLES } from "@/utils/constants";

export const DASHBOARD_NAV = {
  [USER_ROLES.SEEKER]: {
    title: "Job Seeker Dashboard",
    dashboardPath: "/seeker/dashboard",
    accountPath: "/seeker/account",
    changePasswordPath: "/seeker/change-password",
    items: [
      { label: "Dashboard", to: "/seeker/dashboard", icon: LayoutDashboard },
      { label: "Browse Jobs", to: "/seeker/browse-jobs", icon: Search },
      { label: "My Resume", to: "/seeker/resume", icon: FileText },
      { label: "Job Alerts", to: "/seeker/job-alerts", icon: Bell },
      {
        label: "Applied Jobs",
        to: "/seeker/applied-jobs",
        icon: BriefcaseBusiness,
      },

      { label: "Account", to: "/seeker/account", icon: UserCircle },
      { label: "Change Password", to: "/seeker/change-password", icon: Lock },
    ],
  },
  [USER_ROLES.EMPLOYER]: {
    title: "Employer Dashboard",
    dashboardPath: "/employer/dashboard",
    accountPath: "/employer/account",
    changePasswordPath: "/employer/change-password",
    items: [
      { label: "Dashboard", to: "/employer/dashboard", icon: LayoutDashboard },
      { label: "Manage Jobs", to: "/employer/jobs", icon: Briefcase },
      { label: "Post a Job", to: "/employer/jobs/new", icon: FilePlus },
      { label: "Applications", to: "/employer/applications", icon: Users },
      { label: "Browse Resumes", to: "/employer/resumes", icon: FileText },
      { label: "Account", to: "/employer/account", icon: UserCircle },
      { label: "Change Password", to: "/employer/change-password", icon: Lock },
    ],
  },
  [USER_ROLES.ADMIN]: {
    title: "Admin Dashboard",
    dashboardPath: "/admin/dashboard",
    accountPath: null,
    changePasswordPath: null,
    items: [
      { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Users", to: "/admin/users", icon: Users },
      { label: "Jobs", to: "/admin/jobs", icon: Briefcase },
      { label: "Reports", to: "/admin/reports", icon: FileBarChart },
    ],
  },
};

export function getDashboardNav(role) {
  return (
    DASHBOARD_NAV[role] ?? {
      title: "Dashboard",
      dashboardPath: null,
      accountPath: null,
      changePasswordPath: null,
      items: [],
    }
  );
}
