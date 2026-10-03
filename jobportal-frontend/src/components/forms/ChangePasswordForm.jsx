import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { PasswordStrengthIndicator } from "@/components/ui/PasswordStrengthIndicator";
import { PasswordMatchIndicator } from "@/components/ui/PasswordMatchIndicator";
import { Button } from "@/components/ui/Button";
import { changePasswordSchema } from "@/lib/validation/changePasswordSchema";
import { authService } from "@/services/authService";

export function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const newPassword = watch("newPassword");
  const confirmNewPassword = watch("confirmNewPassword");

  const { mutate, isPending } = useMutation({
    mutationFn: authService.changePassword,
    onSuccess: () => {
      toast.success("Password updated");
      reset();
    },
    onError: (error) => {
      toast.error(error.message ?? "Could not update your password");
    },
  });

  return (
    <form onSubmit={handleSubmit(mutate)} className="flex flex-col gap-4">
      <PasswordInput
        label="Current password"
        placeholder="••••••••"
        error={errors.currentPassword?.message}
        {...register("currentPassword")}
      />

      <PasswordInput
        label="New password"
        placeholder="••••••••"
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />
      <PasswordStrengthIndicator password={newPassword} />

      <PasswordInput
        label="Confirm new password"
        placeholder="••••••••"
        error={errors.confirmNewPassword?.message}
        {...register("confirmNewPassword")}
      />
      <PasswordMatchIndicator password={newPassword} confirmPassword={confirmNewPassword} />

      <Button type="submit" isLoading={isPending} className="mt-2 w-full">
        Update password
      </Button>
    </form>
  );
}
