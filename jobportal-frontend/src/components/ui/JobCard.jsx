import { Link } from "react-router-dom";
import { Globe, MapPin, Banknote } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatSalaryRange, formatRelative } from "@/utils/formatters";
import { convertUsdToNPR } from "@/utils/formatters";

export function JobCard({ job, currency="USD" }) {
  const salaryMin = currency === "NPR" ? convertUsdToNPR(job.salaryMin) : job.salaryMin;
  const salaryMax = currency === "NPR" ? convertUsdToNPR(job.salaryMax) : job.salaryMax;
  return (
    <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-text">
            <Link to={`/jobs/${job.id}`} className="hover:text-secondary">
              {job.title}
            </Link>
          </h3>
          <Badge tone="brand">{job.type}</Badge>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-accent">
          {job.description}
        </p>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-accent">
          <li className="flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-secondary" />
            {job.companyWebsite}
          </li>
          <li className="flex items-center gap-1.5">
            <Banknote className="h-4 w-4 text-secondary" />
            {formatSalaryRange(salaryMin, salaryMax, currency)}
          </li>
          <li className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-secondary" />
            {job.location}
          </li>
        </ul>
      </div>
      <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
        <Link
          to={`/jobs/${job.id}`}
          className="rounded-lg bg-secondary px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
        >
          Apply
        </Link>
        <span className="text-xs text-accent">
          {formatRelative(job.postedAt)}
        </span>
      </div>
    </Card>
  );
}
