import { JobBrowser } from "@/components/jobs/JobBrowser";

export function BrowseJobs() {
  return (
    <JobBrowser
      title="Browse jobs"
      subtitleSuffix=" matching your profile"
      searchClassName="mt-6 bg-surface"
    />
  );
}
