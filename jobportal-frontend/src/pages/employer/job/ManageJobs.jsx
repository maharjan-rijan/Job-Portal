import { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { formatDate } from "@/utils/formatters";
import { MOCK_EMPLOYER_JOBS } from "@/lib/mockData";

// TODO: no employer-scoped jobService endpoint yet — this list lives in
// local state and resets on reload. Swap for useJobs({ mine: true }) +
// a delete mutation (same pattern as jobService.remove) once it exists.
export function ManageJobs() {
  const [jobs, setJobs] = useState(MOCK_EMPLOYER_JOBS);

  const toggleStatus = (id) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? { ...job, status: job.status === "Open" ? "Closed" : "Open" }
          : job
      )
    );
  };

  const handleDelete = (id, title) => {
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;
    setJobs((prev) => prev.filter((job) => job.id !== id));
    toast.success("Job deleted");
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">Manage jobs</h1>
          <p className="mt-1 text-sm text-accent">
            {jobs.length} job{jobs.length === 1 ? "" : "s"} posted
          </p>
        </div>
        <PrimaryButton as={Link} to="/employer/jobs/new">
          <Plus className="h-4 w-4" />
          Post a job
        </PrimaryButton>
      </div>

      <Card className="mt-6 p-0">
        <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 border-b border-primary/10 px-5 py-3 text-xs font-medium uppercase text-accent sm:grid">
          <span>Title</span>
          <span>Type</span>
          <span>Location</span>
          <span>Applicants</span>
          <span>Status</span>
          <span />
        </div>

        {jobs.map((job) => (
          <div
            key={job.id}
            className="grid grid-cols-2 gap-3 border-b border-primary/10 px-5 py-4 text-sm last:border-0 sm:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] sm:items-center"
          >
            <div>
              <p className="font-medium text-text">{job.title}</p>
              <p className="text-xs text-accent">
                Posted {formatDate(job.postedAt)}
              </p>
            </div>
            <span className="text-accent">{job.type}</span>
            <span className="text-accent">{job.location}</span>
            <Link
              to="/employer/applications"
              className="flex items-center gap-1.5 text-secondary hover:underline"
            >
              <Users className="h-3.5 w-3.5" />
              {job.applicantsCount}
            </Link>
            <button onClick={() => toggleStatus(job.id)} className="w-fit">
              <Badge tone={job.status === "Open" ? "success" : "neutral"}>
                {job.status}
              </Badge>
            </button>
            <div className="flex justify-end gap-3">
              <Link
                to={`/employer/jobs/${job.id}/edit`}
                className="text-accent hover:text-secondary"
                aria-label={`Edit ${job.title}`}
              >
                <Pencil className="h-4 w-4" />
              </Link>
              <button
                onClick={() => handleDelete(job.id, job.title)}
                className="text-accent hover:text-red-600"
                aria-label={`Delete ${job.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {jobs.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-accent">
            You haven't posted any jobs yet.
          </p>
        )}
      </Card>
    </div>
  );
}
