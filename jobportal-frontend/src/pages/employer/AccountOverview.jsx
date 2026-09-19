import { Link } from "react-router-dom";
import { Mail, Globe, CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/utils/formatters";

const STATS = [
  { label: "Open jobs", value: 2 },
  { label: "Total applicants", value: 66 },
  { label: "Company profile", value: "85%" },
];

function initials(name = "") {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AccountOverview() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 text-lg font-semibold text-secondary">
            {initials(user?.name || "Employer")}
          </div>
          <div>
            <h1 className="text-lg font-semibold text-text">
              {user?.company?.name ?? user?.name ?? "Your company"}
            </h1>
            <Badge tone="brand" className="mt-1">
              Employer
            </Badge>
          </div>
        </div>
        <SecondaryButton as={Link} to="/employer/jobs/new">
          Post a job
        </SecondaryButton>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <p className="text-sm text-accent">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-text">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="text-base font-semibold text-text">Account details</h2>
        <dl className="mt-4 flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-secondary" />
            <dt className="text-accent">Email</dt>
            <dd className="ml-auto font-medium text-text">
              {user?.email ?? "—"}
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-secondary" />
            <dt className="text-accent">Website</dt>
            <dd className="ml-auto font-medium text-text">
              {user?.website ?? "Not set"}
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-secondary" />
            <dt className="text-accent">Member since</dt>
            <dd className="ml-auto font-medium text-text">
              {formatDate(user?.createdAt)}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
