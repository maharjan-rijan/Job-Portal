import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LinkIcon } from "lucide-react";
import toast from "react-hot-toast";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { PasswordStrengthIndicator } from "@/components/ui/PasswordStrengthIndicator";
import { PasswordMatchIndicator } from "@/components/ui/PasswordMatchIndicator";
import { Button } from "@/components/ui/Button";
import { resetPasswordSchema } from "@/lib/validation/resetPasswordSchema";
import { passwordResetService } from "@/services/passwordResetService";

/**
 * Last step of both flows. Reads ?token=…&email=… — put there either by the
 * link in the reset email or by the OTP popup after the code was verified.
 */
export function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const { mutate, isPending } = useMutation({
    mutationFn: (values) =>
      passwordResetService.resetPassword({
        email,
        token,
        password: values.password,
      }),
    onSuccess: () => {
      toast.success("Password reset successful! Please log in.");
      navigate("/login", { replace: true });
    },
    onError: (error) =>
      toast.error(error.message ?? "Could not reset password"),
  });

  if (!token || !email) {
    return (
      <div className="rounded-lg border border-primary/10 bg-background p-6 text-center">
        <LinkIcon className="mx-auto h-8 w-8 text-accent" />
        <p className="mt-3 text-sm text-primary">
          This reset link is invalid or incomplete. Please request a new one.
        </p>
        <Link
          to="/forgot-password"
          className="mt-4 inline-block text-sm font-medium text-secondary"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((values) => mutate(values))}
      className="flex flex-col gap-4"
    >
  
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
      <PasswordMatchIndicator
        password={password}
        confirmPassword={confirmPassword}
      />

      <Button type="submit" isLoading={isPending} className="mt-2 w-full">
        Reset password
      </Button>
    </form>
  );
}
