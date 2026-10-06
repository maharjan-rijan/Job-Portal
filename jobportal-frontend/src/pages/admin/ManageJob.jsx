import { useState } from "react";
import { Briefcase, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SearchBar } from "@/components/ui/SearchBar";
import { Dropdown } from "@/components/ui/Dropdown";
import { QueryState } from "@/components/ui/QueryState";
import { useAdminJobs, useAdminDeleteJob } from "@/hooks/useAdmin";
import { formatDate } from "@/utils/formatters";

const STATUS_FILTER_OPTIONS = [
  { label: "All statuses", value: "" },
  { label: "Open", value: "Open" },
  { label: "Closed", value: "Closed" },
];

export function AdminJobs() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const filters = { search: search || undefined, status: status || undefined };
  const { data: jobs = [], isLoading, isError, error } = useAdminJobs(filters);
  const { mutate: deleteJob, isPending: isDeleting } = useAdminDeleteJob();

  const handleDelete = (job) => {
    if (!window.confirm(`Delete "${job.title}"? This can't be undone.`)) return;

    deleteJob(job.id, {
      onSuccess: () => toast.success("Job deleted"),
      onError: (err) => toast.error(err.message ?? "Could not delete this job"),
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">Manage jobs</h1>
          <p className="mt-1 text-sm text-accent">
            {isLoading
              ? "Loading…"
              : `${jobs.length} job${jobs.length === 1 ? "" : "s"} posted`}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by job title or company"
          className="sm:flex-1"
        />
        <Dropdown
          options={STATUS_FILTER_OPTIONS}
          value={status}
          onChange={setStatus}
          placeholder="All statuses"
          className="sm:w-48"
        />
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        errorLabel="Could not load jobs"
      >
        <Card className="mt-6 overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-primary/10 text-xs uppercase text-accent">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">
                  Title
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Posted by
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Type
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Applicants
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Status
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="transition-colors hover:bg-primary/5"
                >
                  <td className="whitespace-nowrap px-5 py-4">
                    <p className="font-medium text-text">{job.title}</p>
                    <p className="text-xs text-accent">
                      Posted {formatDate(job.postedAt)}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <p className="text-text">{job.creatorName}</p>
                    {job.companyName && (
                      <p className="text-xs text-accent">{job.companyName}</p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-accent">
                    {job.type}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-accent">
                    {job.applicantsCount}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <Badge tone={job.status === "Open" ? "success" : "neutral"}>
                      {job.status}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <button
                      onClick={() => handleDelete(job)}
                      disabled={isDeleting}
                      className="text-accent hover:text-red-600 disabled:opacity-50"
                      aria-label={`Delete ${job.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {jobs.length === 0 && (
            <div className="flex flex-col items-center gap-2 px-5 py-14 text-center text-sm text-accent">
              <Briefcase className="h-6 w-6" />
              No jobs match your filters.
            </div>
          )}
        </Card>
      </QueryState>
    </div>
  );
}
