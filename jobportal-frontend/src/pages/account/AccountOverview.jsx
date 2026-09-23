import { Link } from "react-router-dom";
import { Mail, Globe, MapPin, CalendarDays, Pencil } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/utils/formatters";
import { USER_ROLES } from "@/utils/constants";

function initials(name = "") {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Everything that differs between a seeker's and an employer's Account
 * Overview lives here — the JSX below is identical for both, it just
 * reads from whichever config matches the logged-in user's role.
 */
const ROLE_CONFIG = {
  [USER_ROLES.SEEKER]: {
    badgeLabel: "Job Seeker",
    displayName: (user) => user?.name ?? "Your account",
    editPath: "/seeker/resume",
    secondaryAction: null,
    stats: [
      { label: "Applications sent", value: 12 },
      { label: "Saved jobs", value: 8 },
      { label: "Profile completeness", value: "70%" },
    ],
    details: [
      { icon: Mail, label: "Email", value: (user) => user?.email ?? "—" },
      { icon: MapPin, label: "Location", value: (user) => user?.location ?? "Not set" },
      { icon: CalendarDays, label: "Member since", value: (user) => formatDate(user?.created_at) },
    ],
  },
  [USER_ROLES.EMPLOYER]: {
    badgeLabel: "Employer",
    displayName: (user) => user?.company?.name ?? user?.name ?? "Your company",
    editPath: "/employer/profile/edit",
    secondaryAction: { to: "/employer/jobs/new", label: "Post a job" },
    stats: [
      { label: "Open Jobs", value: 2 },
      { label: "Total Applications", value: 66 },
      { label: "Company Profile", value: "85%" },
    ],
    details: [
      { icon: Mail, label: "Email", value: (user) => user?.email ?? "—" },
      { icon: Globe, label: "Website", value: (user) => user?.company?.website ?? "Not set" },
      { icon: CalendarDays, label: "Member since", value: (user) => formatDate(user?.created_at) },
    ],
  },
};

export function AccountOverview() {
  const { user } = useAuth();
  const config = ROLE_CONFIG[user?.role] ?? ROLE_CONFIG[USER_ROLES.SEEKER];

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 text-lg font-semibold text-secondary">
            {initials(user?.name || config.badgeLabel)}
          </div>
          <div>
            <h1 className="text-lg font-semibold text-text">
              {config.displayName(user)}
            </h1>
            <Badge tone="brand" className="mt-1">
              {config.badgeLabel}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <SecondaryButton as={Link} to={config.editPath}>
            <Pencil className="h-4 w-4" />
            Edit profile
          </SecondaryButton>
          {config.secondaryAction && (
            <SecondaryButton as={Link} to={config.secondaryAction.to}>
              {config.secondaryAction.label}
            </SecondaryButton>
          )}
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {config.stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-sm text-accent">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-text">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="text-base font-semibold text-text">
          Account details
        </h2>
        <dl className="mt-4 flex flex-col gap-3 text-sm">
          {config.details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-secondary" />
              <dt className="text-accent">{label}</dt>
              <dd className="ml-auto font-medium text-text">{value(user)}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}
