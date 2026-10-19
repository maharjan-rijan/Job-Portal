import { Link } from "react-router-dom";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";
import logo from "@/assets/images/logo/logo.svg";

export function ForgotPassword() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-2xl border border-primary/10 bg-surface p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <Link to="/" className="inline-block">
            <img src={logo} alt="JobSansar" className="h-8 w-auto" />
          </Link>
          <h1 className="mt-6 text-xl font-bold text-text">
            Reset your password
          </h1>
          <p className="mt-1 text-sm text-accent">
            Enter the email you registered with, then choose to get a reset link
            or a verification code.
          </p>
        </div>

        <div className="mt-6">
          <ForgotPasswordForm />
        </div>

        <p className="mt-6 text-center text-sm text-accent">
          Remember your password?{" "}
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
