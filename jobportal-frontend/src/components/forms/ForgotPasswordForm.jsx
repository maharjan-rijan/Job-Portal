import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { KeyRound, Link2, MailCheck } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";
import { TextInput } from "@/components/ui/TextInput";
import { Button } from "@/components/ui/Button";
import { OtpVerifyModal } from "@/components/forms/OtpVerifyModal";
import { passwordResetService, OTP_LENGTH } from "@/services/passwordResetService";
import { cn } from "@/utils/cn";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const METHODS = [
  {
    value: "link",
    icon: Link2,
    title: "Email me a reset link",
    description: "Open the link in your inbox to choose a new password.",
  },
  {
    value: "otp",
    icon: KeyRound,
    title: `Email me a ${OTP_LENGTH}-digit code`,
    description: "Type the code here to verify it's you.",
  },
];

const RESEND_SECONDS = 60;

/**
 * Forgot-password flow, all on one page:
 *   email  ->  choose method  ->  link: "check your inbox"
 *                             ->  otp:  popup to enter the code -> /reset-password
 */
export function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email"); // "email" | "method" | "linkSent"
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState("link");
  const [otpOpen, setOtpOpen] = useState(false);
  const [linkCooldownUntil, setLinkCooldownUntil] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const { mutateAsync: sendReset, isPending: isSending } = useMutation({
    mutationFn: (chosen) => passwordResetService.sendReset({ email, method: chosen }),
  });

  const goToReset = (token) => {
    setOtpOpen(false);
    navigate(`/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`);
  };

  const handleSend = async (chosen = method) => {
    try {
      await sendReset(chosen);
      if (chosen === "otp") {
        setOtpOpen(true);
      } else {
        setLinkCooldownUntil(Date.now() + RESEND_SECONDS * 1000);
        setStep("linkSent");
        toast.success("Reset link sent");
      }
    } catch (error) {
      toast.error(error.message ?? "Something went wrong");
    }
  };

  const handleResendLink = () => {
    if (Date.now() < linkCooldownUntil) {
      const secs = Math.ceil((linkCooldownUntil - Date.now()) / 1000);
      toast.error(`Please wait ${secs}s before requesting another link`);
      return;
    }
    handleSend("link");
  };

  // ── Step 1: email ────────────────────────────────────────────────
  if (step === "email") {
    return (
      <form
        onSubmit={handleSubmit((values) => {
          setEmail(values.email);
          setStep("method");
        })}
        className="flex flex-col gap-4"
      >
        <TextInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoFocus
          error={errors.email?.message}
          {...register("email")}
        />
        <Button type="submit" className="mt-2 w-full">
          Continue
        </Button>
      </form>
    );
  }

  // ── Step 3 (link): confirmation ──────────────────────────────────
  if (step === "linkSent") {
    return (
      <div className="rounded-lg border border-primary/10 bg-background p-6 text-center">
        <MailCheck className="mx-auto h-8 w-8 text-secondary" />
        <p className="mt-3 text-sm text-primary">
          Check your inbox! We've sent a password reset link to{" "}
          <span className="font-medium text-text">{email}</span>. It expires in 60 minutes.
        </p>
        <div className="mt-4 flex flex-col items-center gap-2 text-sm">
          <button
            type="button"
            onClick={handleResendLink}
            disabled={isSending}
            className="font-medium text-secondary hover:underline disabled:opacity-60"
          >
            {isSending ? "Sending…" : "Resend link"}
          </button>
          <button
            type="button"
            onClick={() => {
              setMethod("otp");
              setStep("method");
            }}
            className="text-accent hover:text-text"
          >
            Use a code instead
          </button>
          <Link to="/login" className="font-medium text-secondary">
            Back to Log in
          </Link>
        </div>
      </div>
    );
  }

  // ── Step 2: choose how to reset ──────────────────────────────────
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between rounded-lg border border-primary/10 bg-background px-3.5 py-2.5 text-sm">
        <span className="truncate font-medium text-text">{email}</span>
        <button
          type="button"
          onClick={() => setStep("email")}
          className="ml-3 shrink-0 text-secondary hover:underline"
        >
          Change
        </button>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-medium text-primary">How would you like to reset?</legend>
        {METHODS.map(({ value, icon: Icon, title, description }) => (
          <label
            key={value}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors focus-within:ring-2 focus-within:ring-secondary/30",
              method === value ? "border-secondary bg-secondary/5" : "border-primary/20 hover:border-primary/40",
            )}
          >
            <input
              type="radio"
              name="reset-method"
              value={value}
              checked={method === value}
              onChange={() => setMethod(value)}
              className="sr-only"
            />
            <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", method === value ? "text-secondary" : "text-accent")} />
            <span>
              <span className="block text-sm font-medium text-text">{title}</span>
              <span className="block text-xs text-accent">{description}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <Button type="button" onClick={() => handleSend()} isLoading={isSending} className="mt-2 w-full">
        {method === "otp" ? "Send code" : "Send reset link"}
      </Button>

      <OtpVerifyModal
        open={otpOpen}
        email={email}
        onClose={() => setOtpOpen(false)}
        onVerified={goToReset}
        onResend={() => passwordResetService.sendReset({ email, method: "otp" })}
      />
    </div>
  );
}
