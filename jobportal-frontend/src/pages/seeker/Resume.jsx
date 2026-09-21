import { Loader2 } from "lucide-react";
import { ResumeForm } from "@/components/forms/ResumeForm";
import { useResume } from "@/hooks/useResume";
export function Resume() {
  const { data: resume, isLoading, isError } = useResume();

  return (
    <div className="mx-auto max-w-8xl">
      <h1 className="text-xl font-semibold text-text">My Resume</h1>
      <p className="mt-1 text-sm text-accent">
        Keep this up to date — employers see it when you apply.
      </p>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-secondary" />
        </div>
      )}

      {isError && (
        <p className="py-12 text-center text-sm text-red-600">
          Could not load your resume. You can still fill it out below.
        </p>
      )}

      {!isLoading && (
        <div className="mt-6">
          <ResumeForm resume={resume} />
        </div>
      )}
    </div>
  );
}
