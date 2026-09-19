import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { PostJobForm } from "@/components/forms/PostJobForm";

export function PostJob() {
  const navigate = useNavigate();

  return (
    <div className="max-w-8xl">
      <h1 className="text-xl font-semibold text-text">Post a job</h1>
      <p className="mt-1 text-sm text-accent">
        Fill in the details below — candidates will see this exactly as written.
      </p>

      <Card className="mt-6">
        <PostJobForm onSuccess={() => navigate("/employer/jobs")} />
      </Card>
    </div>
  );
}
