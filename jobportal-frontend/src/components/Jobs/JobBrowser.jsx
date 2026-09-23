import { useEffect, useState } from "react";
import { SearchBar } from "@/components/ui/SearchBar";
import { JobCard } from "@/components/ui/JobCard";
import { QueryState } from "@/components/ui/QueryState";
import { CurrencyToggle } from "@/components/ui/CurrencyToggle";
import { useJobs } from "@/hooks/useJobs";
import { useCurrency } from "@/hooks/useCurrency";

export function JobBrowser({
  title,
  headingClassName = "text-xl font-semibold text-text",
  subtitleSuffix = "",
  initialKeyword = "",
  searchClassName = "mt-6",
  emptyLabel = (keyword) => `No jobs match "${keyword}".`,
}) {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [debouncedKeyword, setDebouncedKeyword] = useState(initialKeyword);
  const [currency, setCurrency] = useCurrency();

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
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className={headingClassName}>{title}</h1>
          <p className="mt-1 text-sm text-accent">
            {isLoading ? "Loading…" : `${jobs.length} open role${jobs.length === 1 ? "" : "s"}${subtitleSuffix}`}
          </p>
        </div>
        <CurrencyToggle value={currency} onChange={setCurrency} />
      </div>

      <SearchBar
        value={keyword}
        onChange={setKeyword}
        placeholder="Search by title, company, or location"
        className={searchClassName}
      />

      <QueryState isLoading={isLoading} isError={isError} error={error} errorLabel="Could not load jobs">
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} currency={currency} />
          ))}
          {jobs.length === 0 && (
            <p className="col-span-full py-12 text-center text-sm text-accent">
              {emptyLabel(keyword)}
            </p>
          )}
        </div>
      </QueryState>
    </div>
  );
}
