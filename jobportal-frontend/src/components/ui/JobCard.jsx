import { Link } from "react-router-dom";
import { Globe, DollarSign, MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatSalaryRange, formatRelative } from "@/utils/formatters";

export function JobCard({ job }) {
  return (
    <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-ink-900">
            <Link to={`/jobs/${job.id}`} className="hover:text-brand-500">
              {job.title}
            </Link>
          </h3>
          <Badge tone="brand">{job.type}</Badge>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-ink-500">{job.description}</p>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-500">
          <li className="flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-brand-500" />
            {job.companyWebsite}
          </li>
          <li className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4 text-brand-500" />
            {formatSalaryRange(job.salaryMin, job.salaryMax)}
          </li>
          <li className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-brand-500" />
            {job.location}
          </li>
        </ul>
      </div>
      <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
        <Link
          to={`/jobs/${job.id}`}
          className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
        >
          Apply
        </Link>
        <span className="text-xs text-ink-400">{formatRelative(job.postedAt)}</span>
      </div>
    </Card>
  );
}
