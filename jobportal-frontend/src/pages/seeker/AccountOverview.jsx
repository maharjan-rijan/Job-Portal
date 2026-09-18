import { Link } from "react-router-dom";
import { Mail, MapPin, CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/utils/formatters";

const STATS = [
  { label: "Applications sent", value: 12 },
  { label: "Saved jobs", value: 8 },
  { label: "Profile completeness", value: "70%" },
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
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-lg font-semibold text-brand-600">
            {initials(user?.name || "Job Seeker")}
          </div>
          <div>
            <h1 className="text-lg font-semibold text-ink-900">
              {user?.name ?? "Your account"}
            </h1>
            <Badge tone="brand" className="mt-1">
              Job Seeker
            </Badge>
          </div>
        </div>
        <SecondaryButton as={Link} to="/seeker/resume">
          Edit profile
        </SecondaryButton>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <p className="text-sm text-ink-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-ink-900">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="text-base font-semibold text-ink-900">
          Account details
        </h2>
        <dl className="mt-4 flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-brand-500" />
            <dt className="text-ink-500">Email</dt>
            <dd className="ml-auto font-medium text-ink-900">
              {user?.email ?? "—"}
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-brand-500" />
            <dt className="text-ink-500">Location</dt>
            <dd className="ml-auto font-medium text-ink-900">
              {user?.location ?? "Not set"}
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-brand-500" />
            <dt className="text-ink-500">Member since</dt>
            <dd className="ml-auto font-medium text-ink-900">
              {formatDate(user?.createdAt)}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
