import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { ProfileForm } from "@/components/forms/ProfileForm";

// Everything that differs between the two roles lives here, so the page
// itself is one component: <EditProfile variant="seeker" /> or "employer".
const COPY = {
  seeker: {
    subtitle: "Update your contact details and photo.",
    backTo: "/seeker/account",
  },
  employer: {
    subtitle: "Update your contact details and company information.",
    backTo: "/employer/account",
  },
};

export function EditProfile({ variant = "seeker" }) {
  const navigate = useNavigate();
  const { subtitle, backTo } = COPY[variant] ?? COPY.seeker;

  return (
    <div className="max-w-8xl">
      <h1 className="text-xl font-semibold text-text">Edit profile</h1>
      <p className="mt-1 text-sm text-accent">{subtitle}</p>

      <Card className="mt-6">
        <ProfileForm variant={variant} onSuccess={() => navigate(backTo)} />
      </Card>
    </div>
  );
}
