import { Link } from "react-router-dom";
import { Mail, Globe, MapPin, CalendarDays, Pencil } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { useAuth } from "@/hooks/useAuth";
import { useMyJobs } from "@/hooks/useJobs";
import { useApplications, useMyApplications } from "@/hooks/useApplications";
import { useSavedJobs } from "@/hooks/useSavedJobs";
import { useResume } from "@/hooks/useResume";
import { formatDate } from "@/utils/formatters";
import { USER_ROLES } from "@/utils/constants";
import {
  getEmployerProfileCompleteness,
  getSeekerProfileCompleteness,
} from "@/utils/profileCompleteness";

const ROLE_CONFIG = {
  [USER_ROLES.SEEKER]: {
    badgeLabel: "Job Seeker",
    displayName: (user) => user?.name ?? "Your account",
    editPath: "/seeker/profile/edit",
    secondaryAction: null,
    // values are filled in below from real query data — see STAT_VALUES.
    statDefs: [
      { key: "applications", label: "Applications Sent" },
      { key: "saved", label: "Saved Jobs" },
      { key: "completeness", label: "Profile Completeness", suffix: "%" },
    ],
    details: [
      { icon: Mail, label: "Email", value: ({ user }) => user?.email ?? "—" },
      {
        icon: MapPin,
        label: "Location",
        // Location lives on the seeker's resume record, not on the auth
        // user object — AccountOverview already fetches it separately
        // via useResume() below, so that's what this reads from.
        value: ({ resume }) => resume?.location || "Not set",
      },
      {
        icon: CalendarDays,
        label: "Member since",
        value: ({ user }) => formatDate(user?.created_at),
      },
    ],
  },
  [USER_ROLES.EMPLOYER]: {
    badgeLabel: "Employer",
    displayName: (user) => user?.company?.name ?? user?.name ?? "Your company",
    editPath: "/employer/profile/edit",
    secondaryAction: null,
    statDefs: [
      { key: "openJobs", label: "Open Jobs" },
      { key: "totalApplications", label: "Total Applications" },
      { key: "completeness", label: "Company Profile", suffix: "%" },
    ],
    details: [
      { icon: Mail, label: "Email", value: ({ user }) => user?.email ?? "—" },
      {
        icon: Globe,
        label: "Website",
        value: ({ user }) => user?.company?.website ?? "Not set",
      },
      {
        icon: CalendarDays,
        label: "Member since",
        value: ({ user }) => formatDate(user?.created_at),
      },
    ],
  },
};

export function AccountOverview() {
  const { user } = useAuth();
  const isEmployer = user?.role === USER_ROLES.EMPLOYER;
  const config = ROLE_CONFIG[user?.role] ?? ROLE_CONFIG[USER_ROLES.SEEKER];

  // Each query is gated to the role that actually owns its endpoint, same
  // pattern used in the Dashboard — the hook still runs for the other
  // role (Rules of Hooks), it just stays disabled and unused there.
  const { data: myJobs } = useMyJobs({ enabled: isEmployer });
  const { data: employerApplications } = useApplications(undefined, {
    enabled: isEmployer,
  });
  const { data: myApplications } = useMyApplications({ enabled: !isEmployer });
  const { data: savedJobs } = useSavedJobs({ enabled: !isEmployer });
  const { data: resume } = useResume({ enabled: !isEmployer });

  const STAT_VALUES = {
    applications: myApplications?.length ?? 0,
    saved: savedJobs?.length ?? 0,
    completeness: isEmployer
      ? getEmployerProfileCompleteness(user)
      : getSeekerProfileCompleteness(resume),
    openJobs: (myJobs ?? []).filter((job) => job.status === "Open").length,
    totalApplications: employerApplications?.length ?? 0,
  };

  const stats = config.statDefs.map((def) => ({
    ...def,
    value: `${STAT_VALUES[def.key]}${def.suffix ?? ""}`,
  }));

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar
            src={user?.avatar_url}
            name={user?.name || config.badgeLabel}
            size={64}
          />

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
            Edit Profile
          </SecondaryButton>
          {config.secondaryAction && (
            <SecondaryButton as={Link} to={config.secondaryAction.to}>
              {config.secondaryAction.label}
            </SecondaryButton>
          )}
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-sm text-accent">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-text">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="text-base font-semibold text-text">Account Details</h2>
        <dl className="mt-4 flex flex-col gap-3 text-sm">
          {config.details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-secondary" />
              <dt className="text-accent">{label}</dt>
              <dd className="ml-auto font-medium text-text">
                {value({ user, resume })}
              </dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}
