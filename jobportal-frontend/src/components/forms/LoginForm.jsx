import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { TextInput } from "@/components/ui/TextInput";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/lib/validation/authSchemas";
import { USER_ROLES } from "@/utils/constants";

export function LoginForm({ onSuccess }) {
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

      <div>
        <PasswordInput
          label="Password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
        <div className="mt-1 text-end">
          <Link
            to="/forgot-password"
            className="text-xs font-medium text-secondary hover:text-secondary"
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
