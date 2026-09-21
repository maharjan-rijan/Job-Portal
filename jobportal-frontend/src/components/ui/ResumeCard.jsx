import { Link } from "react-router-dom";
import { MapPin, Briefcase, GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SecondaryButton } from "@/components/ui/SecondaryButton";

function initials(name = "") {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ResumeCard({ resume }) {
  const latestExperience = resume.experience?.[0];
  const latestEducation = resume.education?.[0];

  return (
    <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-sm font-semibold text-secondary">
          {initials(resume.name)}
        </span>
        <div>
          <h3 className="text-base font-semibold text-text">{resume.name}</h3>
          <p className="text-sm text-secondary">{resume.title}</p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-accent">
            <li className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {resume.location}
            </li>
            {latestExperience && (
              <li className="flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" />
                {latestExperience.jobTitle} at {latestExperience.companyName}
              </li>
            )}
            {latestEducation && (
              <li className="flex items-center gap-1">
                <GraduationCap className="h-3.5 w-3.5" />
                {latestEducation.degree}, {latestEducation.fieldOfStudy}
              </li>
            )}
          </ul>
        </div>
      </div>
      <SecondaryButton as={Link} to={`/employer/resumes/${resume.id}`} className="shrink-0">
        View resume
      </SecondaryButton>
    </Card>
  );
}
