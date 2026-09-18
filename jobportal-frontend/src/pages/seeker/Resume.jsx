import { ResumeForm } from "@/components/forms/ResumeForm";

export function Resume() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-xl font-semibold text-ink-900">My Resume</h1>
      <p className="mt-1 text-sm text-ink-500">
        Keep this up to date — employers see it when you apply.
      </p>
      <div className="mt-6">
        <ResumeForm />
      </div>
    </div>
  );
}
