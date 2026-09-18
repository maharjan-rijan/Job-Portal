import { createBrowserRouter } from "react-router-dom";

import { PublicLayout } from "@/layouts/PublicLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { SeekerLayout } from "@/layouts/SeekerLayout";
import { EmployerLayout } from "@/layouts/EmployerLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

import { Home } from "@/pages/public/Home";
import { JobList } from "@/pages/public/JobList";
import { JobDetails } from "@/pages/public/JobDetails";
import { About } from "@/pages/public/About";
import { Contact } from "@/pages/public/Contact";
import { BlogList } from "@/pages/public/BlogList";
import { BlogPost } from "@/pages/public/BlogPost";
import { NotFound } from "@/pages/public/NotFound";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { SeekerDashboard } from "@/pages/seeker/Dashboard";
import { BrowseJobs } from "@/pages/seeker/BrowseJobs";
import { Resume } from "@/pages/seeker/Resume";
import { JobAlerts } from "@/pages/seeker/JobAlerts";
import { AccountOverview as SeekerAccountOverview } from "@/pages/seeker/AccountOverview";
// import { ChangePassword as SeekerChangePassword } from "@/pages/seeker/ChangePassword";
import { EmployerDashboard } from "@/pages/employer/Dashboard";
import { AccountOverview as EmployerAccountOverview } from "@/pages/employer/AccountOverview";
// import { ChangePassword as EmployerChangePassword } from "@/pages/employer/ChangePassword";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { AdminLayout } from "@/layouts/AdminLayout";

import { USER_ROLES } from "@/utils/constants";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/jobs", element: <JobList /> },
      { path: "/jobs/:jobId", element: <JobDetails /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/blog", element: <BlogList /> },
      { path: "/blog/:postId", element: <BlogPost /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={[USER_ROLES.SEEKER]} />,
    children: [
      {
        element: <SeekerLayout />,
        children: [
          { path: "/seeker/dashboard", element: <SeekerDashboard /> },
          { path: "/seeker/browse-jobs", element: <BrowseJobs /> },
          { path: "/seeker/resume", element: <Resume /> },
          { path: "/seeker/job-alerts", element: <JobAlerts /> },
          { path: "/seeker/account", element: <SeekerAccountOverview /> },
          //{ path: "/seeker/change-password", element: <SeekerChangePassword /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={[USER_ROLES.EMPLOYER]} />,
    children: [
      {
        element: <EmployerLayout />,
        children: [
          { path: "/employer/dashboard", element: <EmployerDashboard /> },
          { path: "/employer/account", element: <EmployerAccountOverview /> },
          // { path: "/employer/change-password", element: <EmployerChangePassword /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [{ path: "/admin/dashboard", element: <AdminDashboard /> }],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
