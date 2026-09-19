import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { TextInput } from "@/components/ui/TextInput";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema } from "@/lib/validation/authSchemas";
import { USER_ROLES } from "@/utils/constants";

export function RegisterForm({ onSuccess = () => {} }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register: registerUser } = useAuth();
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

  const onSubmit = async (values) => {
    try {
      const user = await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        company_name: values.companyName,
      });
      toast.success("Account created");
      onSuccess(user);
    } catch (error) {
      toast.error(error.message ?? "Could not create account");
    }
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

        <div className="relative">
          <TextInput
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-[34px] text-accent hover:text-primary focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="relative">
          <TextInput
            label="Confirm password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-[34px] text-accent hover:text-primary focus:outline-none"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

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
    </div>
  );
}
