import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { ResumeForm } from "@/components/forms/ResumeForm";
import { QueryState } from "@/components/ui/QueryState";
import { useResume } from "@/hooks/useResume";

export function Resume() {
  const { data: resume, isLoading, isError } = useResume();

  return (
    <div className="mx-auto max-w-8xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-text">My Resume</h1>
          <p className="mt-1 text-sm text-accent">
            Keep this up to date — employers see it when you apply.
          </p>
        </div>
        {resume && (
          <Link
            to="/seeker/resume/preview"
            className="flex items-center gap-1.5 text-sm font-medium text-secondary hover:underline"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Link>
        )}
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        errorLabel="Could not load your resume. You can still fill it out below"
      >
        <div className="mt-6">
          <ResumeForm resume={resume} />
        </div>
      </QueryState>
    </div>
  );
}
