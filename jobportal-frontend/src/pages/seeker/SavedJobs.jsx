import { Link } from "react-router-dom";
import { HeartOff } from "lucide-react";
import { JobCard } from "@/components/ui/JobCard";
import { QueryState } from "@/components/ui/QueryState";
import { useSavedJobs } from "@/hooks/useSavedJobs";
import { Pagination } from "@/components/ui/Pagination";
import { usePagination } from "@/hooks/usePagination";

export function SavedJobs() {
  const { data: jobs = [], isLoading, isError, error } = useSavedJobs();
  const {
    pageItems: pagedJobs,
    page,
    setPage,
    totalPages,
    from,
    to,
    totalItems,
  } = usePagination(jobs, { pageSize: 10 });
  return (
    <div>
      <h1 className="text-xl font-semibold text-text">Saved jobs</h1>
      <p className="mt-1 text-sm text-accent">
        {isLoading
          ? "Loading…"
          : `${jobs.length} job${jobs.length === 1 ? "" : "s"} saved`}
      </p>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        errorLabel="Could not load your saved jobs"
      >
        <div className="mt-6 flex flex-col gap-4">
          {pagedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}

          {jobs.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-16 text-center text-sm text-accent">
              <HeartOff className="h-6 w-6" />
              <p>You haven't saved any jobs yet.</p>
              <Link
                to="/jobs"
                className="font-medium text-secondary hover:underline"
              >
                Browse jobs
              </Link>
            </div>
          )}
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          from={from}
          to={to}
          totalItems={totalItems}
          className="mt-4"
        />
      </QueryState>
    </div>
  );
}
