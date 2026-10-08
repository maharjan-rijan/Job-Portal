import { useState } from "react";
import { Briefcase } from "lucide-react";
import toast from "react-hot-toast";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SearchBar } from "@/components/ui/SearchBar";
import { Dropdown } from "@/components/ui/Dropdown";
import { QueryState } from "@/components/ui/QueryState";
import { usePagination } from "@/hooks/usePagination";
import { Pagination } from "@/components/ui/Pagination";

import {
  useAdminJobs,
  useToggleJobStatus,
  useToggleJobFeatured,
} from "@/hooks/useAdmin";

import { formatDate } from "@/utils/formatters";

const STATUS_FILTER_OPTIONS = [
  { label: "All statuses", value: "" },
  { label: "Open", value: "Open" },
  { label: "Closed", value: "Closed" },
];

export function AdminJobs() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const filters = {
    search: search || undefined,
    status: status || undefined,
  };

  const { data: jobs = [], isLoading, isError, error } = useAdminJobs(filters);

  const { mutate: toggleStatus, isPending: isTogglingStatus } =
    useToggleJobStatus();

  const { mutate: toggleFeatured, isPending: isTogglingFeatured } =
    useToggleJobFeatured();

  const {
    pageItems: pagedJobs,
    page,
    setPage,
    totalPages,
    from,
    to,
    totalItems,
  } = usePagination(jobs, { pageSize: 10, resetKey: JSON.stringify(filters) });

  const handleToggleStatus = (job) => {
    toggleStatus(job.id, {
      onSuccess: (updated) => {
        toast.success(
          updated.status === "Open"
            ? `${job.title} opened`
            : `${job.title} closed`,
        );
      },
      onError: (err) => {
        toast.error(err.message ?? "Could not update job status");
      },
    });
  };

  const handleToggleFeatured = (job) => {
    toggleFeatured(job.id, {
      onSuccess: (updated) => {
        toast.success(
          updated.isFeatured
            ? `${job.title} marked as featured`
            : `${job.title} removed from featured`,
        );
      },
      onError: (err) => {
        toast.error(err.message ?? "Could not update featured status");
      },
    });
  };

  return (
    <div>
      {/* Header */}
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

      {/* Filters */}
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

      {/* Content */}
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
                  Featured
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-primary/10">
              {pagedJobs.map((job) => (
                <tr
                  key={job.id}
                  className="transition-colors hover:bg-primary/5"
                >
                  {/* Title */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <p className="font-medium text-text">{job.title}</p>

                    <p className="text-xs text-accent">
                      Posted {formatDate(job.postedAt)}
                    </p>
                  </td>

                  {/* Creator */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <p className="text-text">{job.creatorName}</p>

                    {job.companyName && (
                      <p className="text-xs text-accent">{job.companyName}</p>
                    )}
                  </td>

                  {/* Type */}
                  <td className="whitespace-nowrap px-5 py-4 text-accent">
                    {job.type}
                  </td>

                  {/* Applicants */}
                  <td className="whitespace-nowrap px-5 py-4 text-accent">
                    {job.applicantsCount}
                  </td>

                  {/* Status Toggle */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(job)}
                      disabled={isTogglingStatus}
                      className="w-fit focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={
                        job.status === "Open"
                          ? `Close ${job.title}`
                          : `Open ${job.title}`
                      }
                    >
                      <Badge
                        tone={job.status === "Open" ? "success" : "neutral"}
                      >
                        {job.status === "Open" ? "Open" : "Closed"}
                      </Badge>
                    </button>
                  </td>

                  {/* Featured Toggle */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(job)}
                      disabled={isTogglingFeatured}
                      className="w-fit focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={
                        job.isFeatured
                          ? `Remove ${job.title} from featured`
                          : `Feature ${job.title}`
                      }
                    >
                      <Badge tone={job.isFeatured ? "success" : "neutral"}>
                        {job.isFeatured ? "Yes" : "No"}
                      </Badge>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {jobs.length === 0 && (
            <div className="flex flex-col items-center gap-2 px-5 py-14 text-center text-sm text-accent">
              <Briefcase className="h-6 w-6" />
              No jobs match your filters.
            </div>
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
