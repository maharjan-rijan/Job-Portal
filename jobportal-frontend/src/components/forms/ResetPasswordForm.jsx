import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { PasswordStrengthIndicator } from "@/components/ui/PasswordStrengthIndicator";
import { PasswordMatchIndicator } from "@/components/ui/PasswordMatchIndicator";
import { Button } from "@/components/ui/Button";
import { resetPasswordSchema } from "@/lib/validation/resetPasswordSchema";

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const onSubmit = async (values) => {
    try {
      // Replace with your API call (e.g. await confirmPasswordReset(token, values.password))
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Password reset successful!");
      navigate("/login");
    } catch (error) {
      toast.error(error.message ?? "Could not reset password");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <PasswordInput
        label="New password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />
      <PasswordStrengthIndicator password={password} />

      <PasswordInput
        label="Confirm new password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <PasswordMatchIndicator password={password} confirmPassword={confirmPassword} />

      <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
        Reset password
      </Button>
    </form>
  );
}
