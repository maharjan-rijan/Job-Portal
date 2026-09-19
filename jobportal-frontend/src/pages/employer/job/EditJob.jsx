import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { PostJobForm } from "@/components/forms/PostJobForm";
import { NotFound } from "@/pages/public/NotFound";
import { useJob } from "@/hooks/useJobs";

export function EditJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const { data: job, isLoading, isError } = useJob(jobId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-secondary" />
      </div>
    );
  }

  if (isError || !job) return <NotFound />;

  return (
    <div className="max-w-4xl">
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
