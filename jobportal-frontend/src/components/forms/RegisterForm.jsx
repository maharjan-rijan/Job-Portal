import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { TextInput } from "@/components/ui/TextInput";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { PasswordStrengthIndicator } from "@/components/ui/PasswordStrengthIndicator";
import { PasswordMatchIndicator } from "@/components/ui/PasswordMatchIndicator";
import { Button } from "@/components/ui/Button";
import { RegisterOtpModal } from "@/components/forms/RegisterOtpModal";
import { authService } from "@/services/authService";
import { registerSchema } from "@/lib/validation/authSchemas";
import { USER_ROLES } from "@/utils/constants";

export function RegisterForm({ onSuccess = () => {} }) {
  // Email the user is verifying; the popup is open while this is set.
  const [pendingEmail, setPendingEmail] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: USER_ROLES.SEEKER,
      companyName: "",
    },
  });

  const role = watch("role");
  const isEmployer = role === USER_ROLES.EMPLOYER;
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // Step 1: send the code (no account is created yet), then open the popup.
  const onSubmit = async (values) => {
    try {
      const { email } = await authService.register({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        company_name: values.companyName,
      });
      setPendingEmail(email ?? values.email);
      toast.success("We sent a verification code to your email");
    } catch (error) {
      toast.error(error.message ?? "Could not create account");
    }
  };

  // Step 2: the popup verified the code and the backend created the account.
  const handleVerified = () => {
    setPendingEmail(null);
    toast.success("Account registered successfully. Please log in.");
    onSuccess();
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 rounded-lg bg-background p-1">
        {[USER_ROLES.SEEKER, USER_ROLES.EMPLOYER].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setValue("role", option)}
            className={`rounded-md py-2 text-sm font-medium capitalize transition-colors ${
              role === option ? "bg-surface text-text shadow-sm" : "text-accent"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 flex flex-col gap-4"
      >
        <TextInput
          label="Full name"
          placeholder="Jane Doe"
          error={errors.name?.message}
          {...register("name")}
        />

        {isEmployer && (
          <TextInput
            label="Company name"
            placeholder="Acme Corp"
            error={errors.companyName?.message}
            {...register("companyName")}
          />
        )}

        <TextInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <PasswordInput
          label="Password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
        <PasswordStrengthIndicator password={password} />

        <PasswordInput
          label="Confirm password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <PasswordMatchIndicator
          password={password}
          confirmPassword={confirmPassword}
        />

        <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-accent">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-secondary">
          Log in
        </Link>
      </p>

      <RegisterOtpModal
        open={Boolean(pendingEmail)}
        email={pendingEmail ?? ""}
        onClose={() => setPendingEmail(null)}
        onVerified={handleVerified}
      />
    </div>
  );
}
