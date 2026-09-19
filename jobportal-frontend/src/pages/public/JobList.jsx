import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { SearchBar } from "@/components/ui/SearchBar";
import { JobCard } from "@/components/ui/JobCard";
import { useJobs } from "@/hooks/useJobs";

export function JobList() {
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("q") ?? "");
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);

  // Avoid firing a request on every keystroke.
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedKeyword(keyword), 400);
    return () => clearTimeout(timeout);
  }, [keyword]);

  const { data, isLoading, isError, error } = useJobs(
    debouncedKeyword ? { q: debouncedKeyword } : undefined
  );
  const jobs = data?.data ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-text">Browse jobs</h1>
      <p className="mt-1 text-sm text-accent">
        {isLoading ? "Loading…" : `${jobs.length} open role${jobs.length === 1 ? "" : "s"}`}
      </p>

      <SearchBar
        value={keyword}
        onChange={setKeyword}
        placeholder="Search by title, company, or location"
        className="mt-6"
      />

      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-secondary" />
        </div>
      )}

      {isError && (
        <p className="py-12 text-center text-sm text-red-600">
          Could not load jobs{error?.message ? `: ${error.message}` : ""}.
        </p>
      )}

      {!isLoading && !isError && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
          {jobs.length === 0 && (
            <p className="col-span-full py-12 text-center text-sm text-accent">
              No jobs match "{keyword}".
            </p>
          )}
        </div>
      )}
    </div>
  );
}
