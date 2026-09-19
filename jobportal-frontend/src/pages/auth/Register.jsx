import { RegisterForm } from "@/components/forms/RegisterForm";
import { USER_ROLES } from "@/utils/constants";
import { useNavigate } from "react-router-dom";

export function Register() {
  const navigate = useNavigate();
  const handleSuccess = (user) => {
    navigate(
      user.role === USER_ROLES.EMPLOYER
        ? "/employer/dashboard"
        : "/seeker/dashboard",
      { replace: true },
    );
  };
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <h1 className="text-center text-xl font-semibold text-text">
        Create your account
      </h1>
      <p className="mt-1 text-center text-sm text-accent">
        Join as a candidate or start hiring.
      </p>

      <div className="mt-6">
        <RegisterForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
