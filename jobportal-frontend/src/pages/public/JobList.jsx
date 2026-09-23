import { useSearchParams } from "react-router-dom";
import { JobBrowser } from "@/components/jobs/JobBrowser";

export function JobList() {
  const [searchParams] = useSearchParams();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <JobBrowser
        title="Browse jobs"
        headingClassName="text-2xl font-semibold text-text"
        initialKeyword={searchParams.get("q") ?? ""}
      />
    </div>
  );
}
