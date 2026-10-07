import { createBrowserRouter } from "react-router-dom";

import { PublicLayout } from "@/layouts/PublicLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
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
import { Dashboard } from "@/pages/auth/Dashboard";
import { BrowseJobs } from "@/pages/seeker/BrowseJobs";
import { Resume } from "@/pages/seeker/Resume";
import { JobAlerts } from "@/pages/seeker/JobAlerts";
import { AccountOverview } from "@/pages/account/AccountOverview";
import { ChangePassword } from "@/pages/auth/ChangePassword";
import { ManageJobs } from "@/pages/employer/job/ManageJobs";
import { PostJob } from "@/pages/employer/job/PostJob";
import { EditJob } from "@/pages/employer/job/EditJob";
import { Applications } from "@/pages/employer/Applications";
import { BrowseResumes } from "@/pages/employer/Resume/BrowseResume";
import { ResumeDetail } from "@/pages/employer/Resume/ResumeDetail";
import { EditProfile as EmployerEditProfile } from "@/pages/employer/EditProfile";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { ManageUsers } from "@/pages/admin/ManageUser";
import { AdminJobs } from "@/pages/admin/ManageJob";
import { ListBlog } from "@/pages/admin/blog/ListBlog";
import { CreateBlog } from "@/pages/admin/blog/CreateBlog";
import { EditBlog } from "@/pages/admin/blog/EditBlog";

import { USER_ROLES } from "@/utils/constants";
import { SavedJobs } from "@/pages/seeker/SavedJobs";
import { MyApplications } from "@/pages/seeker/MyApplications";
import { ResumePreview } from "@/pages/seeker/ResumePreview";

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
        element: <DashboardLayout />,
        children: [
          { path: "/seeker/dashboard", element: <Dashboard /> },
          { path: "/seeker/browse-jobs", element: <BrowseJobs /> },
          { path: "/seeker/saved-jobs", element: <SavedJobs /> },
          { path: "/seeker/applied-jobs", element: <MyApplications /> },
          { path: "/seeker/resume", element: <Resume /> },
          { path: "/seeker/resume/preview", element: <ResumePreview /> },
          { path: "/seeker/job-alerts", element: <JobAlerts /> },
          { path: "/seeker/account", element: <AccountOverview /> },
          { path: "/seeker/change-password", element: <ChangePassword /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={[USER_ROLES.EMPLOYER]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/employer/dashboard", element: <Dashboard /> },
          { path: "/employer/jobs", element: <ManageJobs /> },
          { path: "/employer/jobs/new", element: <PostJob /> },
          { path: "/employer/jobs/:jobId/edit", element: <EditJob /> },
          { path: "/employer/applications", element: <Applications /> },
          { path: "/employer/resumes", element: <BrowseResumes /> },
          { path: "/employer/resumes/:resumeId", element: <ResumeDetail /> },
          { path: "/employer/account", element: <AccountOverview /> },
          { path: "/employer/profile/edit", element: <EmployerEditProfile /> },
          { path: "/employer/change-password", element: <ChangePassword /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/admin/dashboard", element: <AdminDashboard /> },
          { path: "/admin/users", element: <ManageUsers /> },
          { path: "/admin/jobs", element: <AdminJobs /> },
          { path: "/admin/blog", element: <ListBlog /> },
          { path: "/admin/blog/new", element: <CreateBlog /> },
          { path: "/admin/blog/:postId/edit", element: <EditBlog /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
