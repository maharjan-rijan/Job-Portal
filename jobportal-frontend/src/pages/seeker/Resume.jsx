import { ResumeForm } from "@/components/forms/ResumeForm";

export function Resume() {
  return (
    <div className="max-w-8xl">
      <h1 className="text-xl font-semibold text-text">My Resume</h1>
      <p className="mt-1 text-sm text-accent">
        Keep this up to date — employers see it when you apply.
      </p>
      <div className="mt-6">
        <ResumeForm />
      </div>
    </div>
  );
}
