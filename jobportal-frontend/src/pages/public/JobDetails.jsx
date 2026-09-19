import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, MapPin, Globe, CalendarDays, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { Modal } from "@/components/ui/Modal";
import { LoginForm } from "@/components/forms/LoginForm";
import { ApplyForm } from "@/components/forms/ApplyForm";
import { NotFound } from "@/pages/public/NotFound";
import { useJob } from "@/hooks/useJobs";
import { useAuth } from "@/hooks/useAuth";
import { formatDate, formatRelative, formatSalaryRange } from "@/utils/formatters";

function initials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ListSection({ title, items }) {
  if (!items?.length) return null;
  return (
    <div className="mt-6">
      <h2 className="text-base font-semibold text-text">{title}</h2>
      <ul className="mt-3 flex flex-col gap-2 text-sm text-primary">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function JobDetails() {
  const { jobId } = useParams();
  const { isAuthenticated } = useAuth();

  const [saved, setSaved] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  const { data: job, isLoading, isError } = useJob(jobId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-secondary" />
      </div>
    );
  }

  if (isError || !job) return <NotFound />;

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }
    setApplyOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
        {/* Job body */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-lg font-semibold text-secondary">
                  {initials(job.company)}
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-text">
                    {job.title}
                  </h1>
                  <p className="mt-1 text-sm text-accent">
                    <a
                      href={`https://${job.companyWebsite}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-secondary hover:underline"
                    >
                      {job.company}
                    </a>
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-accent">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <span className="text-sm font-semibold text-text">
                  {formatSalaryRange(job.salaryMin, job.salaryMax)}
                </span>
                <Badge tone="brand">{job.type}</Badge>
              </div>
            </div>

            <div className="mt-6 border-t border-primary/10 pt-6">
              <h2 className="text-base font-semibold text-text">
                Job Description
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-primary">
                {job.description}
              </p>
            </div>

            <ListSection title="Responsibilities" items={job.responsibilities} />
            <ListSection title="Requirements" items={job.requirements} />
            <ListSection title="Benefits" items={job.benefits} />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-24">
          <Card className="flex flex-col gap-3 sm:flex-row">
            <PrimaryButton onClick={handleApplyClick} className="flex-1">
              Apply Now
            </PrimaryButton>
            <SecondaryButton
              onClick={() => setSaved((value) => !value)}
              className="flex-1"
            >
              <Heart className={saved ? "h-4 w-4 fill-current" : "h-4 w-4"} />
              {saved ? "Saved" : "Save Job"}
            </SecondaryButton>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-text">Job Overview</h2>
            <dl className="mt-4 flex flex-col gap-3 text-sm">
              {[
                ["Published on", formatDate(job.postedAt)],
                ["Vacancies", job.vacancies],
                ["Employment Status", job.type],
                ["Experience", job.experienceLevel],
                ["Job Location", job.location],
                ["Salary", formatSalaryRange(job.salaryMin, job.salaryMax)],
                ["Application Deadline", formatDate(job.applicationDeadline)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-accent">{label}</dt>
                  <dd className="text-right font-medium text-text">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="flex flex-col gap-2 text-sm text-accent">
            <p className="flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-secondary" />
              <Link
                to={`https://${job.companyWebsite}`}
                className="hover:text-secondary"
              >
                {job.companyWebsite}
              </Link>
            </p>
            <p className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-secondary" />
              Posted {formatRelative(job.postedAt)}
            </p>
          </Card>
        </div>
      </div>

      <Modal open={loginOpen} onClose={() => setLoginOpen(false)} title="Log in to apply">
        <LoginForm
          onSuccess={() => {
            setLoginOpen(false);
            setApplyOpen(true);
          }}
        />
      </Modal>

      <Modal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        title={`Apply for ${job.title}`}
      >
        <ApplyForm jobId={job.id} onSuccess={() => setApplyOpen(false)} />
      </Modal>
    </div>
  );
}
