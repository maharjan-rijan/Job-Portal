import { useMemo, useState } from "react";
import { ExternalLink, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import { Dropdown } from "@/components/ui/Dropdown";
import { Pagination } from "@/components/ui/Pagination";
import { usePagination } from "@/hooks/usePagination";

import { QueryState } from "@/components/ui/QueryState";
import {
  useApplications,
  useUpdateApplicationStatus,
} from "@/hooks/useApplications";
import { useMyJobs } from "@/hooks/useJobs";
import { formatDate } from "@/utils/formatters";
import { APPLICATION_STATUS_OPTIONS } from "@/utils/constants";

function initials(name = "") {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Applications() {
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("");

  const { data: myJobs = [] } = useMyJobs();
  const jobOptions = useMemo(
    () => [
      { label: "All jobs", value: "" },
      ...myJobs.map((job) => ({ label: job.title, value: job.id })),
    ],
    [myJobs],
  );
  const statusOptions = useMemo(
    () => [{ label: "All statuses", value: "" }, ...APPLICATION_STATUS_OPTIONS],
    [],
  );

  const {
    data: applications = [],
    isLoading,
    isError,
    error,
  } = useApplications({
    jobId: jobId || undefined,
    status: status || undefined,
  });
  const { mutate: updateStatus } = useUpdateApplicationStatus();

  const {
    pageItems: pagedApplications,
    page,
    setPage,
    totalPages,
    from,
    to,
    totalItems,
  } = usePagination(applications, {
    pageSize: 10,
    resetKey: `${jobId}:${status}`,
  });
  const handleStatusChange = (application, newStatus) => {
    updateStatus(
      { id: application.id, status: newStatus },
      {
        onSuccess: () =>
          toast.success(`Marked ${application.name} as ${newStatus}`),
        onError: (err) => toast.error(err.message ?? "Could not update status"),
      },
    );
  };

  return (
    <div>
      <div>
        <h1 className="text-xl font-semibold text-text">Applications</h1>
        <p className="mt-1 text-sm text-accent">
          {isLoading
            ? "Loading…"
            : `${applications.length} applicant${applications.length === 1 ? "" : "s"}`}
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:max-w-md">
        <Dropdown
          placeholder="Filter by job"
          options={jobOptions}
          value={jobId}
          onChange={setJobId}
        />
        <Dropdown
          placeholder="Filter by status"
          options={statusOptions}
          value={status}
          onChange={setStatus}
        />
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        errorLabel="Could not load applicants"
      >
        <Card className="mt-6 p-0">
          <div className="hidden grid-cols-[2fr_2fr_1fr_1fr_1.3fr] gap-4 border-b border-primary/10 px-5 py-3 text-xs font-medium uppercase text-accent sm:grid">
            <span>Applicant</span>
            <span>Job</span>
            <span>Applied</span>
            <span>Resume</span>
            <span>Status</span>
          </div>

          {pagedApplications.map((app) => (
            <div
              key={app.id}
              className="grid grid-cols-2 gap-3 border-b border-primary/10 px-5 py-4 text-sm last:border-0 sm:grid-cols-[2fr_2fr_1fr_1fr_1.3fr] sm:items-center"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-xs font-semibold text-secondary">
                  {initials(app.name)}
                </span>
                <div>
                  <p className="font-medium text-text">{app.name}</p>
                  <a
                    href={`mailto:${app.email}`}
                    className="flex items-center gap-1 text-xs text-accent hover:text-secondary"
                  >
                    <Mail className="h-3 w-3" />
                    {app.email}
                  </a>
                </div>
              </div>
              <span className="text-accent">{app.jobTitle}</span>
              <span className="text-accent">{formatDate(app.appliedAt)}</span>
              <span>
                {app.resumeUrl ? (
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-secondary hover:underline"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-accent">—</span>
                )}
              </span>
              <Dropdown
                options={APPLICATION_STATUS_OPTIONS}
                value={app.status}
                onChange={(value) => handleStatusChange(app, value)}
              />
            </div>
          ))}

          {applications.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-accent">
              No applicants match these filters yet.
            </p>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            from={from}
            to={to}
            totalItems={totalItems}
          />
        </Card>
      </QueryState>
    </div>
  );
}
