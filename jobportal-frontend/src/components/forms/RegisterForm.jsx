import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { TextInput } from "@/components/ui/TextInput";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { PasswordStrengthIndicator } from "@/components/ui/PasswordStrengthIndicator";
import { PasswordMatchIndicator } from "@/components/ui/PasswordMatchIndicator";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema } from "@/lib/validation/authSchemas";
import { USER_ROLES } from "@/utils/constants";

export function RegisterForm({ onSuccess = () => {} }) {
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
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

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
          label="Full Name"
          placeholder="Jane Doe"
          error={errors.name?.message}
          {...register("name")}
        />

        {isEmployer && (
          <TextInput
            label="Company Name"
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
          label="Confirm Password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <PasswordMatchIndicator password={password} confirmPassword={confirmPassword} />

        <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
          Create Account
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
