import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { TextInput } from "@/components/ui/TextInput";
import { Button } from "@/components/ui/Button";
import { changePasswordSchema } from "@/lib/validation/changePasswordSchema";
import { authService } from "@/services/authService";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function ChangePasswordForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewConfirmedPassword, setShowNewConfirmedPassword] =
    useState(false);
  const {
    register,
    handleSubmit,
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
      <div className="relative">
        <TextInput
          label="Current password"
          type={showCurrentPassword ? "text" : "password"}
          placeholder="••••••••"
          error={errors.currentPassword?.message}
          {...register("currentPassword")}
        />
        <button
          type="button"
          onClick={() => setShowCurrentPassword((prev) => !prev)}
          className="absolute right-3 top-[34px] text-accent hover:text-primary focus:outline-none"
          aria-label={showCurrentPassword ? "Hide password" : "Show password"}
        >
          {showCurrentPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="relative">
        <TextInput
          label="New password"
          type={showNewPassword ? "text" : "password"}
          placeholder="••••••••"
          error={errors.newPassword?.message}
          {...register("newPassword")}
        />
        <button
          type="button"
          onClick={() => setShowNewPassword((prev) => !prev)}
          className="absolute right-3 top-[34px] text-accent hover:text-primary focus:outline-none"
          aria-label={showNewPassword ? "Hide password" : "Show password"}
        >
          {showNewPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="relative">
        <TextInput
          label="Confirm new password"
          type={showNewConfirmedPassword ? "text" : "password"}
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <button
          type="button"
          onClick={() => setShowNewConfirmedPassword((prev) => !prev)}
          className="absolute right-3 top-[34px] text-accent hover:text-primary focus:outline-none"
          aria-label={
            showNewConfirmedPassword ? "Hide password" : "Show password"
          }
        >
          {showNewConfirmedPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
      <Button type="submit" isLoading={isPending} className="mt-2 w-full">
        Update password
      </Button>
    </form>
  );
}
