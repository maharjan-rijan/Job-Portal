import { Link, Outlet } from "react-router-dom";
import logo from "@/assets/images/logo/logo.svg";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
      <div className="w-full max-w-md rounded-card bg-white p-8 shadow-sm">
        <Link to="/" className="mb-6 flex justify-center">
          <img src={logo} alt="JobGrids" className="h-8 w-auto" />
        </Link>
        <Outlet />
      </div>
    </div>
  );
}
