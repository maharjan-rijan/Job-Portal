import { Link, useLocation, useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/forms/LoginForm";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname ?? "/";

  return (
    <div>
      <h1 className="text-center text-xl font-semibold text-text">
        Welcome back
      </h1>
      <p className="mt-1 text-center text-sm text-accent">
        Log in to manage your jobs and applications.
      </p>

      <div className="mt-6">
        <LoginForm onSuccess={() => navigate(redirectTo, { replace: true })} />
      </div>

      <p className="mt-6 text-center text-sm text-accent">
        Don't have an account?{" "}
        <Link to="/register" className="font-medium text-secondary">
          Sign up
        </Link>
      </p>
    </div>
  );
}
