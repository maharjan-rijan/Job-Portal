import { useEffect } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import toast from "react-hot-toast";
import { LoginForm } from "@/components/forms/LoginForm";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const redirectTo = location.state?.from?.pathname ?? "/";
  // Set by lib/axios.js when an admin blocks the user mid-session.
  const wasBlocked = searchParams.get("blocked") === "1";

  // Show it as a top-right toast (same as other errors), once, then drop the
  // flag from the URL so a refresh doesn't show it again. The fixed id keeps
  // StrictMode's double effect run from showing two toasts.
  useEffect(() => {
    if (!wasBlocked) return;
    toast.error("Your account has been blocked by the administrator.", {
      id: "account-blocked",
    });
    setSearchParams({}, { replace: true });
  }, [wasBlocked, setSearchParams]);

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
