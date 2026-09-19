import { Card } from "@/components/ui/Card";
import { ChangePasswordForm } from "@/components/forms/ChangePasswordForm";

export function ChangePassword() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-xl font-semibold text-text">Change password</h1>
      <p className="mt-1 text-sm text-accent">
        Use a password that's at least 6 characters and not used elsewhere.
      </p>
      <Card className="mt-6">
        <ChangePasswordForm />
      </Card>
    </div>
  );
}
