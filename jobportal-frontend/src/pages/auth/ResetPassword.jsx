import { Link } from "react-router-dom";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";
import logo from "@/assets/images/logo/logo.svg";

export function ResetPassword() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-surface p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <Link to="/" className="inline-block">
            <img src={logo} alt="JobSansar" className="h-8 w-auto" />
          </Link>
          <h1 className="mt-6 text-xl font-bold text-gray-900">
            Set new password
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Your new password must be at least 8 characters long.
          </p>
        </div>

        <div className="mt-6">
          <ResetPasswordForm />
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Back to{" "}
          <Link
            to="/login"
            className="font-medium text-secondary hover:text-secondary"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
