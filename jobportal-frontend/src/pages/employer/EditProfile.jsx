import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { EmployerProfileForm } from "@/components/forms/EmployerProfileForm";

export function EditProfile() {
  const navigate = useNavigate();

  return (
    <div className="max-w-8xl">
      <h1 className="text-xl font-semibold text-text">Edit profile</h1>
      <p className="mt-1 text-sm text-accent">
        Update your contact details and company information.
      </p>

      <Card className="mt-6">
        <EmployerProfileForm onSuccess={() => navigate("/employer/account")} />
      </Card>
    </div>
  );
}
