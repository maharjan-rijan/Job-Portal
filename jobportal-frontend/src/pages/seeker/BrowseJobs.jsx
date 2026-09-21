import { useMemo, useState } from "react";
import { SearchBar } from "@/components/ui/SearchBar";
import { JobCard } from "@/components/ui/JobCard";
import { CurrencyToggle } from "@/components/ui/CurrencyToggle";
import { useCurrency } from "@/hooks/useCurrency";
import { MOCK_JOBS } from "@/lib/mockData";

export function BrowseJobs() {
  const [keyword, setKeyword] = useState("");
  const [currency, setCurrency] = useCurrency();

  const jobs = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return MOCK_JOBS;
    return MOCK_JOBS.filter((job) =>
      `${job.title} ${job.company} ${job.location}`.toLowerCase().includes(q),
    );
  }, [keyword]);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-text">Browse jobs</h1>
          <p className="mt-1 text-sm text-accent">
            {jobs.length} open role{jobs.length === 1 ? "" : "s"} matching your
            profile
          </p>
        </div>
        <CurrencyToggle value={currency} onChange={setCurrency} />
      </div>
      <SearchBar
        value={keyword}
        onChange={setKeyword}
        placeholder="Search by title, company, or location"
        className="mt-6 bg-surface"
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} currency={currency} />
        ))}
        {jobs.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-accent">
            No jobs match "{keyword}".
          </p>
        )}
      </div>
    </div>
  );
}
