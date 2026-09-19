import {
  LayoutDashboard,
  Search,
  FileText,
  Bell,
  Briefcase,
  FilePlus,
  Users,
  FileBarChart,
  BriefcaseBusiness,
  Bookmark,
} from "lucide-react";
import { USER_ROLES } from "@/utils/constants";

/**
 * One entry per role. `accountPath`/`changePasswordPath` are optional —
 * DashboardTopbar only renders those menu items when present, so a role
 * without those pages built yet (e.g. admin, for now) just omits them
 * rather than linking to a 404.
 */
export const DASHBOARD_NAV = {
  [USER_ROLES.SEEKER]: {
    title: "Job Seeker Dashboard",
    dashboardPath: "/seeker/dashboard",
    accountPath: "/seeker/account",
    changePasswordPath: "/seeker/change-password",
    items: [
      { label: "Dashboard", to: "/seeker/dashboard", icon: LayoutDashboard },
      { label: "My Account", to: "/seeker/account", icon: Users },
      { label: "Browse Jobs", to: "/seeker/browse-jobs", icon: Search },
      { label: "Applied Jobs", to: "/seeker/applied-jobs", icon: BriefcaseBusiness },
      { label: "Saved Jobs", to: "/seeker/saved-jobs", icon: Bookmark },
      { label: "My Resume", to: "/seeker/resume", icon: FileText },
      { label: "Job Alerts", to: "/seeker/job-alerts", icon: Bell },
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
      { label: "Manage Resumes", to: "/employer/resumes", icon: FileText }
    ],
  },
  [USER_ROLES.ADMIN]: {
    title: "Admin Dashboard",
    dashboardPath: "/admin/dashboard",
    accountPath: "/admin/account",
    changePasswordPath: "/admin/change-password",
    items: [
      { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Users", to: "/admin/users", icon: Users },
      { label: "Job Types", to: "/admin/job-types", icon: BriefcaseBusiness },
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
