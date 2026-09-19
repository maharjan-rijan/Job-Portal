import { Link } from "react-router-dom";
import logo from "@/assets/images/logo/logo.svg";

export function PublicFooter() {
  return (
    <footer className="border-t border-primary/10 bg-ink-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="JobSansar" className="h-8 w-auto" />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-accent">
              Find the right role or the right hire, without the noise.
            </p>
          </div>
          <div className="flex gap-12 text-sm text-accent">
            <div className="flex flex-col gap-2">
              <span className="font-medium text-white">Candidates</span>
              <Link to="/jobs">Browse jobs</Link>
              <Link to="/register">Create profile</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-medium text-white">Employers</span>
              <Link to="/employer/dashboard">Post a job</Link>
              <Link to="/employer/dashboard">Manage applications</Link>
            </div>
          </div>
        </div>
        <p className="mt-10 text-xs text-accent">
          © {new Date().getFullYear()} JobSansar. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
