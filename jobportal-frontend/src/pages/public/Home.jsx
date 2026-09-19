import { Link } from "react-router-dom";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { JobCard } from "@/components/ui/JobCard";
import { MOCK_JOBS } from "@/lib/mockData";
import { TextInput } from "@/components/ui/TextInput";

export function Home() {
  return (
    <>
      <section className="border-b border-primary/10 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold leading-tight text-text sm:text-5xl">
              Find the job that fits your life
            </h1>
            <p className="mt-4 text-lg text-accent">
              Thousands of roles from companies hiring right now. Search by
              title, skill, or company.
            </p>
          </div>

          <form className="mt-8 flex flex-col gap-3 rounded-card bg-surface p-3 shadow-sm sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search className="h-5 w-5 text-accent" />
              <TextInput
                type="text"
                placeholder="Job title, keywords, or company"
                className="h-11 w-full border-0 text-sm text-text placeholder:text-accent focus:outline-none"
              />
            </div>
            <div className="hidden h-8 w-px bg-ink-100 sm:block" />
            <div className="flex flex-1 items-center gap-2 px-3">
              <MapPin className="h-5 w-5 text-accent" />
              <TextInput
                type="text"
                placeholder="City or state"
                className="h-11 w-full border-0 text-sm text-text placeholder:text-accent focus:outline-none"
              />
            </div>
            <Link
              to="/jobs"
              className="flex h-11 items-center justify-center rounded-lg bg-secondary px-6 text-sm font-medium text-white hover:bg-brand-600"
            >
              Search Jobs
            </Link>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-semibold text-text">Featured jobs</h2>
          <Link
            to="/jobs"
            className="flex items-center gap-1 text-sm font-medium text-secondary hover:text-secondary"
          >
            View all jobs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {MOCK_JOBS.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>
    </>
  );
}
