import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { PostJobForm } from "@/components/forms/PostJobForm";
import { NotFound } from "@/pages/public/NotFound";
import { MOCK_JOBS } from "@/lib/mockData";

export function EditJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  // TODO: swap for `useJob(jobId)` from hooks/useJobs.js once a real
  // employer-scoped job endpoint exists — same pattern as JobDetails.jsx.
  const job = MOCK_JOBS.find((item) => item.id === jobId);

  if (!job) return <NotFound />;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-xl font-semibold text-text">Edit job</h1>
      <p className="mt-1 text-sm text-accent">
        Update the listing — changes are visible to candidates immediately.
      </p>

      <Card className="mt-6">
        <PostJobForm job={job} onSuccess={() => navigate("/employer/jobs")} />
      </Card>
    </div>
  );
}
