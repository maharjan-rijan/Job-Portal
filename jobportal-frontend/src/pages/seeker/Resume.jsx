import { ResumeForm } from "@/components/forms/ResumeForm";
import { QueryState } from "@/components/ui/QueryState";
import { useResume } from "@/hooks/useResume";

export function Resume() {
  const { data: resume, isLoading, isError } = useResume();

  return (
    <div className="mx-auto max-w-8xl">
      <h1 className="text-xl font-semibold text-text">My Resume</h1>
      <p className="mt-1 text-sm text-accent">
        Keep this up to date — employers see it when you apply.
      </p>

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
