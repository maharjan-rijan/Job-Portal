import { useSearchParams } from "react-router-dom";
import { ExternalLink, FileWarning } from "lucide-react";
import { isSafeUrl } from "@/utils/resumeLink";

/**
 * Full-page PDF viewer, opened in a new tab: /resume-viewer?url=<pdf url>
 * Used by the employer's Applications list and the seeker's My
 * applications page for uploaded PDF resumes.
 */
export function ResumeViewer() {
  const [params] = useSearchParams();
  const url = params.get("url");
  const valid = url && isSafeUrl(url);

  return (
    <div className="flex h-screen flex-col bg-surface">
      <header className="flex items-center justify-between border-b border-primary/10 px-4 py-3">
        <h1 className="text-sm font-semibold text-text">Resume preview</h1>
        {valid && (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-secondary hover:underline"
          >
            Open original <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </header>

      {valid ? (
        <iframe title="Resume PDF" src={url} className="w-full flex-1 border-0" />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <FileWarning className="h-8 w-8 text-accent" />
          <p className="text-sm font-medium text-text">This resume can't be shown</p>
          <p className="text-xs text-accent">The link is missing or isn't a valid web address.</p>
        </div>
      )}
    </div>
  );
}