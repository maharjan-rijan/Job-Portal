import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import {
  EmployerProfileForm,
  SeekerProfileForm,
} from "@/components/forms/ProfileForm";

/** Shared page shell: heading, subtitle and the card that wraps the form. */
function EditProfileLayout({ description, children }) {
  return (
    <div className="max-w-8xl">
      <h1 className="text-xl font-semibold text-text">Edit profile</h1>
      <p className="mt-1 text-sm text-accent">{description}</p>

      <Card className="mt-6">{children}</Card>
    </div>
  );
}

export function EmployerEditProfile() {
  const navigate = useNavigate();

  return (
    <EditProfileLayout description="Update your contact details and company information.">
      <EmployerProfileForm onSuccess={() => navigate("/employer/account")} />
    </EditProfileLayout>
  );
}

export function SeekerEditProfile() {
  const navigate = useNavigate();

  return (
    <EditProfileLayout description="Update your contact details and photo.">
      <SeekerProfileForm onSuccess={() => navigate("/seeker/account")} />
    </EditProfileLayout>
  );
}