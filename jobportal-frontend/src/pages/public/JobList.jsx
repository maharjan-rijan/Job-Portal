import { useMemo, useState } from "react";
import { Search, MapPin, Briefcase } from "lucide-react";
import { JobCard } from "@/components/ui/JobCard";
import { TextInput } from "@/components/ui/TextInput";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MOCK_JOBS } from "@/lib/mockData";

export function JobList() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  const [activeFilters, setActiveFilters] = useState({
    keyword: "",
    location: "",
    jobTitle: "",
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveFilters({ jobTitle, keyword, location });
  };

  const jobs = useMemo(() => {
    const t = activeFilters.jobTitle.trim().toLowerCase();
    const k = activeFilters.keyword.trim().toLowerCase();
    const l = activeFilters.location.trim().toLowerCase();

    return MOCK_JOBS.filter((job) => {
      const matchesTitle = t ? job.title.toLowerCase().includes(t) : true;
      const matchesKeyword = k
        ? `${job.title} ${job.company} ${job.description || ""}`
            .toLowerCase()
            .includes(k)
        : true;

      const matchesLocation = l ? job.location.toLowerCase().includes(l) : true;

      return matchesTitle && matchesKeyword && matchesLocation;
    });
  }, [activeFilters]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-ink-900">Browse jobs</h1>
      <p className="mt-1 text-sm text-ink-500">
        {jobs.length} open role{jobs.length === 1 ? "" : "s"}
      </p>

      <form
        onSubmit={handleSearch}
        className="mt-6 flex flex-col gap-3 rounded-card border border-ink-100 bg-white p-3 shadow-sm sm:flex-row sm:items-center"
      >
        {/* Job Title Search */}
        <div className="flex flex-1 items-center gap-2 px-3">
          <Briefcase className="h-5 w-5 text-ink-300 shrink-0" />
          <TextInput
            type="text"
            placeholder="Job title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="h-11 w-full border-0 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
          />
        </div>
        <div className="hidden h-8 w-px bg-ink-100 sm:block" />
        {/* Keyword Search */}
        <div className="flex flex-1 items-center gap-2 px-3">
          <Search className="h-5 w-5 text-ink-300 shrink-0" />
          <TextInput
            type="text"
            placeholder="Keywords or skills"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="h-11 w-full border-0 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
          />
        </div>

        <div className="hidden h-8 w-px bg-ink-100 sm:block" />

        {/* Location Search */}
        <div className="flex flex-1 items-center gap-2 px-3">
          <MapPin className="h-5 w-5 text-ink-300 shrink-0" />
          <TextInput
            type="text"
            placeholder="City or state"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-11 w-full border-0 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
          />
        </div>

        <Button
          type="submit"
          className="flex h-11 items-center justify-center rounded-lg bg-brand-500 px-6 text-sm font-medium text-white hover:bg-brand-600 shrink-0"
        >
          Search Jobs
        </Button>
      </form>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
        {jobs.length === 0 && (
          <Card className="col-span-full py-12 text-center">
            <p className="text-sm text-ink-400">
              No jobs match your search criteria.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
