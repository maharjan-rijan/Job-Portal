import { useParams, Link } from "react-router-dom";
import { Loader2, Mail, Globe, MapPin, DollarSign, ArrowLeft, Award } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { NotFound } from "@/pages/public/NotFound";
import { useResumeDetail } from "@/hooks/useResume";

function initials(name = "") {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ResumeDetail() {
  const { resumeId } = useParams();
  const { data: resume, isLoading, isError } = useResumeDetail(resumeId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-secondary" />
      </div>
    );
  }

  if (isError || !resume) return <NotFound />;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/employer/resumes"
        className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-primary"
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
                  <p className="mt-2 text-sm text-accent">{entry.description}</p>
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
  );
}
