import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { OtpInput } from "@/components/ui/OtpInput";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/authService";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

/**
 * Popup shown after "Create account": the user types the 6-digit code that was
 * emailed to them. `onVerified()` fires once the backend has created the account.
 */
export function RegisterOtpModal({ open, email, onClose, onVerified }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (open) {
      setOtp("");
      setError(null);
      setSecondsLeft(RESEND_SECONDS);
    }
  }, [open]);

  useEffect(() => {
    if (!open || secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [open, secondsLeft]);

  const { mutate: verify, isPending } = useMutation({
    mutationFn: () => authService.verifyRegistration({ email, otp }),
    onSuccess: () => onVerified(),
    onError: (err) => {
      setError(err.message ?? "That code is incorrect or has expired");
      setOtp("");
    },
  });

  const handleChange = (next) => {
    setError(null);
    setOtp(next);
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await authService.resendRegistrationCode({ email });
      setOtp("");
      setError(null);
      setSecondsLeft(RESEND_SECONDS);
      toast.success("A new code has been sent");
    } catch (err) {
      toast.error(err.message ?? "Could not resend the code");
    } finally {
      setIsResending(false);
    }
  };

  const complete = otp.length === OTP_LENGTH;

  return (
    <Modal open={open} onClose={isPending ? () => {} : onClose} title="Verify your email">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (complete && !isPending) verify();
        }}
        className="flex flex-col gap-5"
      >
        <p className="text-sm text-accent">
          We sent a {OTP_LENGTH}-digit code to <span className="font-medium text-text">{email}</span>.
          Enter it to finish creating your account. It expires in 10 minutes.
        </p>

        <OtpInput
          length={OTP_LENGTH}
          value={otp}
          onChange={handleChange}
          disabled={isPending}
          hasError={Boolean(error)}
          autoFocus
        />

        {error && (
          <p role="alert" className="text-center text-sm text-red-600">
            {error}
          </p>
        )}

        <Button type="submit" isLoading={isPending} disabled={!complete} className="w-full">
          Verify &amp; create account
        </Button>

        <p className="text-center text-sm text-accent">
          Didn't get it?{" "}
          {secondsLeft > 0 ? (
            <span>Resend in {secondsLeft}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-medium text-secondary hover:underline disabled:opacity-60"
            >
              {isResending ? "Sending…" : "Resend code"}
            </button>
          )}
        </p>
      </form>
    </Modal>
  );
}
