import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { z } from "zod";
import { TextInput } from "@/components/ui/TextInput";
import { Button } from "@/components/ui/Button";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values) => {
    try {
      // Replace with your API call (e.g. await sendPasswordReset(values.email))
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
      toast.success("Reset link sent!");
    } catch (error) {
      toast.error(error.message ?? "Something went wrong");
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-lg border border-primary/10 bg-background p-6 text-center">
        <p className="text-sm text-primary">
          Check your inbox! We've sent password reset instructions to your
          email.
        </p>
        <Link
          to="/login"
          className="mt-4 inline-block text-sm font-medium text-secondary"
        >
          Back to Log in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <TextInput
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
        Send reset link
      </Button>
    </form>
  );
}
