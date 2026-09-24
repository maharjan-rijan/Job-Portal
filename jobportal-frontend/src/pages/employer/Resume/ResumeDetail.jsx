import { useParams, Link } from "react-router-dom";
import {
  Mail,
  Globe,
  MapPin,
  DollarSign,
  ArrowLeft,
  Award,
  Printer,
  Download,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { NotFound } from "@/pages/public/NotFound";
import { useResumeDetail } from "@/hooks/useResume";
import { sanitizeHtml } from "@/utils/sanitizeHtml";

function initials(name = "") {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Builds a self-contained, print-styled HTML document from the resume
 * data — used for the downloaded file.
 */
function buildResumeHtml(resume) {
  const esc = (value) =>
    String(value ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

  const education = (resume.education ?? [])
    .map(
      (e) => `
      <div style="margin-bottom:12px">
        <strong>${esc(e.degree)}, ${esc(e.fieldOfStudy)}</strong><br/>
        <span style="color:#555">${esc(e.school)} · ${esc(e.from)} – ${esc(e.to)}</span>
        ${e.description ? `<div style="margin:4px 0 0">${sanitizeHtml(e.description)}</div>` : ""}
      </div>`
    )
    .join("");

  const experience = (resume.experience ?? [])
    .map(
      (e) => `
      <div style="margin-bottom:12px">
        <strong>${esc(e.jobTitle)} at ${esc(e.companyName)}</strong><br/>
        <span style="color:#555">${esc(e.from)} – ${esc(e.to)}</span>
        ${e.description ? `<p style="margin:4px 0 0">${esc(e.description)}</p>` : ""}
      </div>`
    )
    .join("");

  const achievements = (resume.achievements ?? [])
    .map(
      (a) => `
      <div style="margin-bottom:10px">
        <strong>${esc(a.title)}</strong>
        ${[a.issuer, a.date].filter(Boolean).length ? `<span style="color:#555"> — ${esc([a.issuer, a.date].filter(Boolean).join(" · "))}</span>` : ""}
        ${a.description ? `<p style="margin:4px 0 0">${esc(a.description)}</p>` : ""}
      </div>`
    )
    .join("");

  const links = (resume.socialLinks ?? [])
    .map((l) => `<a href="${esc(l.url)}" style="color:#10b981;margin-right:12px">${esc(l.platform)}</a>`)
    .join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${esc(resume.name)} — Resume</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; color: #18181b; max-width: 720px; margin: 40px auto; line-height: 1.5; }
    h1 { margin: 0 0 4px; font-size: 24px; }
    h2 { font-size: 16px; border-bottom: 1px solid #e5e5e5; padding-bottom: 4px; margin-top: 28px; }
    .meta { color: #555; font-size: 14px; }
  </style>
</head>
<body>
  <h1>${esc(resume.name)}</h1>
  <p class="meta">${esc(resume.title)}</p>
  <p class="meta">${esc(resume.email)} ${resume.location ? "· " + esc(resume.location) : ""} ${resume.website ? "· " + esc(resume.website) : ""}</p>
  ${links ? `<p class="meta">${links}</p>` : ""}

  ${education ? `<h2>Education</h2>${education}` : ""}
  ${experience ? `<h2>Work Experience</h2>${experience}` : ""}
  ${achievements ? `<h2>Achievements &amp; Certificates</h2>${achievements}` : ""}
</body>
</html>`;
}

function downloadResume(resume) {
  const html = buildResumeHtml(resume);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${resume.name?.replace(/\s+/g, "-").toLowerCase() || "resume"}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function ResumeDetail() {
  const { resumeId } = useParams();
  const { data: resume, isLoading, isError } = useResumeDetail(resumeId);

  if (isLoading) return <Spinner fullSection />;

  if (isError || !resume) return <NotFound />;

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="flex-1">
        <Link
          to="/employer/resumes"
          className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-primary print:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to resumes
        </Link>
        <Card className="mt-6">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 text-lg font-semibold text-secondary">
              {initials(resume.name)}
            </span>
            <div>
              <h1 className="text-xl font-semibold text-text">{resume.name}</h1>
              <p className="text-sm text-secondary">{resume.title}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-primary/10 pt-4 text-sm text-accent">
            <a href={`mailto:${resume.email}`} className="flex items-center gap-1.5 hover:text-secondary">
              <Mail className="h-4 w-4" />
              {resume.email}
            </a>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {resume.location}
            </span>
            {resume.website && (
              <a
                href={resume.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-secondary"
              >
                <Globe className="h-4 w-4" />
                {resume.website}
              </a>
            )}
            {resume.expectedSalary && (
              <span className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4" />
                {resume.expectedSalary}
              </span>
            )}
          </div>

          {resume.socialLinks?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {resume.socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-secondary hover:underline"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          )}
        </Card>

        {resume.education?.length > 0 && (
          <Card className="mt-6">
            <h2 className="text-base font-semibold text-text">Education</h2>
            <div className="mt-3 flex flex-col gap-4">
              {resume.education.map((entry, i) => (
                <div
                  key={i}
                  className="border-t border-primary/10 pt-4 first:border-0 first:pt-0"
                >
                  <p className="font-medium text-text">
                    {entry.degree}, {entry.fieldOfStudy}
                  </p>
                  <p className="text-sm text-accent">
                    {entry.school} · {entry.from} – {entry.to}
                  </p>
                  {entry.description && (
                    <div
                      className="prose prose-sm mt-2 max-w-none text-accent"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(entry.description) }}
                    />
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {resume.experience?.length > 0 && (
          <Card className="mt-6">
            <h2 className="text-base font-semibold text-text">Work experience</h2>
            <div className="mt-3 flex flex-col gap-4">
              {resume.experience.map((entry, i) => (
                <div
                  key={i}
                  className="border-t border-primary/10 pt-4 first:border-0 first:pt-0"
                >
                  <p className="font-medium text-text">
                    {entry.jobTitle} at {entry.companyName}
                  </p>
                  <p className="text-sm text-accent">
                    {entry.from} – {entry.to}
                  </p>
                  {entry.description && (
                    <p className="mt-2 text-sm text-accent">{entry.description}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {resume.achievements?.length > 0 && (
          <Card className="mt-6">
            <h2 className="text-base font-semibold text-text">
              Achievements &amp; certificates
            </h2>
            <div className="mt-3 flex flex-col gap-4">
              {resume.achievements.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 border-t border-primary/10 pt-4 first:border-0 first:pt-0"
                >
                  <Award className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <div>
                    <p className="font-medium text-text">{entry.title}</p>
                    {(entry.issuer || entry.date) && (
                      <p className="text-sm text-accent">
                        {[entry.issuer, entry.date].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    {entry.description && (
                      <p className="mt-2 text-sm text-accent">{entry.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      
      <div className="mt-10 w-full shrink-0 print:hidden lg:sticky lg:top-6 lg:w-80">
        <Card className="text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10 text-2xl font-semibold text-secondary">
            {initials(resume.name)}
          </span>
          <h2 className="mt-3 text-base font-semibold text-text">{resume.name}</h2>
          <p className="text-sm text-secondary">{resume.title}</p>
          <p className="mt-1 text-xs text-accent">{resume.location}</p>

          <div className="mt-5 flex flex-col gap-2 border-t border-primary/10 pt-5">
            <SecondaryButton onClick={() => window.print()} className="w-full justify-center">
              <Printer className="h-4 w-4" />
              Print
            </SecondaryButton>
            <SecondaryButton
              onClick={() => downloadResume(resume)}
              className="w-full justify-center"
            >
              <Download className="h-4 w-4" />
              Download
            </SecondaryButton>
          </div>
        </Card>
      </div>
    </div>
  );
}
