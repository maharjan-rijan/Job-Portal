import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { QueryState } from "@/components/ui/QueryState";
import { useMyApplications } from "@/hooks/useApplications";
import { formatDate } from "@/utils/formatters";
import { APPLICATION_STATUS_TONE } from "@/utils/constants";

export function MyApplications() {
  const {
    data: applications = [],
    isLoading,
    isError,
    error,
  } = useMyApplications();

  return (
    <div>
      <h1 className="text-xl font-semibold text-text">My applications</h1>
      <p className="mt-1 text-sm text-accent">
        {isLoading
          ? "Loading…"
          : `${applications.length} application${applications.length === 1 ? "" : "s"}`}
      </p>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        errorLabel="Could not load your applications"
      >
        <Card className="mt-6 p-0">
          <div className="hidden grid-cols-[2fr_1.5fr_1fr_1fr] gap-4 border-b border-primary/10 px-5 py-3 text-xs font-medium uppercase text-accent sm:grid">
            <span>Job</span>
            <span>Company</span>
            <span>Applied</span>
            <span>Status</span>
          </div>

          {applications.map((app) => (
            <div
              key={app.id}
              className="grid grid-cols-2 gap-3 border-b border-primary/10 px-5 py-4 text-sm last:border-0 sm:grid-cols-[2fr_1.5fr_1fr_1fr] sm:items-center"
            >
              <Link
                to={`/jobs/${app.jobId}`}
                className="flex items-center gap-1.5 font-medium text-text hover:text-secondary"
              >
                {app.jobTitle}
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              </Link>
              <span className="text-accent">{app.company ?? "—"}</span>
              <span className="text-accent">{formatDate(app.appliedAt)}</span>
              <Badge
                tone={APPLICATION_STATUS_TONE[app.status] ?? "neutral"}
                className="w-fit capitalize"
              >
                {app.status}
              </Badge>
            </div>
          ))}

          {applications.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-accent">
              You haven't applied to any jobs yet.
            </p>
          )}
        </Card>
      </QueryState>
    </div>
  );
}
