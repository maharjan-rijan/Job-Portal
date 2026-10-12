import { Link } from "react-router-dom";
import { Pencil, Plus, Trash2, Users, Star } from "lucide-react";
import toast from "react-hot-toast";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { QueryState } from "@/components/ui/QueryState";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Pagination } from "@/components/ui/Pagination";
import { formatDate } from "@/utils/formatters";

import { useMyJobs, useSaveJob, useDeleteJob } from "@/hooks/useJobs";
import { useApplications } from "@/hooks/useApplications";
import { usePagination } from "@/hooks/usePagination";

export function ManageJobs() {
  const { data: jobs = [], isLoading, isError, error } = useMyJobs();

  const { data: applications = [], isLoading: applicationsLoading } =
    useApplications();

  const { mutate: saveJob } = useSaveJob();

  const { mutate: deleteJob, isPending: isDeleting } = useDeleteJob();

  const toggleStatus = (job) => {
    saveJob(
      {
        id: job.id,
        payload: {
          status: job.status === "Open" ? "Closed" : "Open",
        },
      },
      {
        onError: (err) =>
          toast.error(err.message ?? "Could not update job status"),
      },
    );
  };

  const handleDelete = (id, title) => {
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;

    deleteJob(id, {
      onSuccess: () => toast.success("Job deleted"),
      onError: (err) => toast.error(err.message ?? "Could not delete this job"),
    });
  };

  /*
   * Calculate applicants for each job from actual applications.
   */
  const jobsWithApplicants = jobs.map((job) => {
    const applicantsCount = applications.filter(
      (app) => String(app.jobId) === String(job.id),
    ).length;

    return {
      ...job,
      applicantsCount,
    };
  });

  const {
    pageItems: pagedJobs,
    page,
    setPage,
    totalPages,
    from,
    to,
    totalItems,
  } = usePagination(jobsWithApplicants, { pageSize: 10 });

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

        <PrimaryButton as={Link} to="/employer/jobs/new">
          <Plus className="h-4 w-4" />
          Post a job
        </PrimaryButton>
      </div>

      <QueryState
        isLoading={isLoading || applicationsLoading}
        isError={isError}
        error={error}
        errorLabel="Could not load your jobs"
      >
        <Card className="mt-6 overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-primary/10 text-xs uppercase text-accent">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">
                  Title
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Type
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Location
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
              {pagedJobs.map((job) => (
                <tr key={job.id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <p className="font-medium text-text">{job.title}</p>
                      {job.isFeatured && (
                        <Badge tone="warning" className="flex items-center gap-1 shrink-0">
                          <Star className="h-3 w-3 fill-current" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-accent">
                      Posted {formatDate(job.postedAt)}
                    </p>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-accent">
                    {job.type}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-accent">
                    {job.location}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <Link
                      to="/employer/applications"
                      className="inline-flex items-center gap-1.5 text-secondary hover:underline"
                    >
                      <Users className="h-3.5 w-3.5" />
                      {job.applicantsCount}
                    </Link>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleStatus(job)}
                      className="w-fit focus:outline-none"
                    >
                      <Badge
                        tone={job.status === "Open" ? "success" : "neutral"}
                      >
                        {job.status}
                      </Badge>
                    </button>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        to={`/employer/jobs/${job.id}/edit`}
                        className="text-accent hover:text-secondary"
                        aria-label={`Edit ${job.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>

                      <button
                        onClick={() => handleDelete(job.id, job.title)}
                        disabled={isDeleting}
                        className="text-accent hover:text-red-600 disabled:opacity-50"
                        aria-label={`Delete ${job.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {jobs.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-accent">
              You haven't posted any jobs yet.
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