import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { TextInput } from "@/components/ui/TextInput";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/lib/validation/authSchemas";
import { USER_ROLES } from "@/utils/constants";

export function LoginForm({ onSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values) => {
    try {
      const user = await login(values);
      toast.success("Welcome back!");
      onSuccess?.(user);
      navigate(
        user.role === USER_ROLES.EMPLOYER
          ? "/"
          : "/",
      );
    } catch (error) {
      toast.error(error.message ?? "Invalid email or password");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <TextInput
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <div className="relative">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-text">Password</label>
        </div>
        <div className="relative mt-1">
          <TextInput
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-3 text-accent hover:text-primary focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        <div className="relative text-end mt-1">
          <Link
            to="/forgot-password"
            className="text-xs font-medium text-secondary hover:text-secondary "
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
        Log in
      </Button>
    </form>
  );
}
