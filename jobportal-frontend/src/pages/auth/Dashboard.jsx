import { Link } from "react-router-dom";
import {
  FileText,
  Heart,
  CalendarCheck,
  Users2,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { QueryState } from "@/components/ui/QueryState";
import { RadialProgress } from "@/components/ui/RadialProgress";
import { StatisticsPanel } from "@/components/ui/StatisticsPanel";
import { MiniBarChart } from "@/components/ui/MiniBarChart";
import { JobCard } from "@/components/ui/JobCard";
import { useAuth } from "@/hooks/useAuth";
import { useMyJobs, useRecommendedJobs } from "@/hooks/useJobs";
import { useMyApplications, useApplications } from "@/hooks/useApplications";
import { useSavedJobs } from "@/hooks/useSavedJobs";
import { useCurrency } from "@/hooks/useCurrency";
import { formatDate } from "@/utils/formatters";
import { cn } from "@/utils/cn";
import { USER_ROLES, APPLICATION_STATUS_TONE } from "@/utils/constants";

const MONTHLY_APPLICATIONS = [
  { month: "Jan", value: 2 },
  { month: "Feb", value: 4 },
  { month: "Mar", value: 3 },
  { month: "Apr", value: 5 },
  { month: "May", value: 3 },
  { month: "Jun", value: 2 },
  { month: "Jul", value: 4 },
  { month: "Aug", value: 1 },
  { month: "Sep", value: 3 },
  { month: "Oct", value: 6 },
  { month: "Nov", value: 5 },
  { month: "Dec", value: 1 },
];

const WEEKLY_APPLICATIONS = [
  { day: "Mon", value: 4 },
  { day: "Tue", value: 7 },
  { day: "Wed", value: 5 },
  { day: "Thu", value: 9 },
  { day: "Fri", value: 6 },
  { day: "Sat", value: 2 },
  { day: "Sun", value: 3 },
];

/**
 * Everything that differs between the seeker and employer dashboards
 * lives here — the JSX below is shared, it just reads whichever config
 * matches the logged-in user's role. `radial: null` (seeker) means the
 * stat cards take the full row instead of sharing it with a gauge card.
 */
const ROLE_CONFIG = {
  [USER_ROLES.SEEKER]: {
    // value is filled in below from real query data — see STAT_VALUES.
    statDefs: [
      { key: "applications", icon: FileText, label: "Applications sent" },
      { key: "saved", icon: Heart, label: "Saved jobs" },
      { key: "interviews", icon: CalendarCheck, label: "Interviews scheduled" },
    ],
    statsGridCols: "sm:grid-cols-3",
    radial: null,
    chartTitle: "Statistics",
    chartSubtitle: "Your application activity over time",
    chartData: MONTHLY_APPLICATIONS,
    chartTabs: [
      { label: "Applications", multiplier: 1 },
      { label: "Interviews", multiplier: 0.4 },
      { label: "Offers", multiplier: 0.15 },
    ],
    bottomTitle: "Recent applications",
    bottomIcon: CalendarCheck,
    // items intentionally omitted — real data comes from useMyApplications()
    // in the component, same as the employer branch's useMyJobs() below.
  },
  [USER_ROLES.EMPLOYER]: {
    statDefs: [
      { key: "openJobs", icon: Briefcase, label: "Open jobs" },
      { key: "totalApplicants", icon: Users2, label: "Total applicants" },
    ],
    statsGridCols: "sm:grid-cols-2",
    radial: {
      title: "Hiring target",
      subtitle: "Positions filled this quarter",
      percent: 55,
      label: "+10%",
      note: "You're on track to fill both roles by month end.",
      footer: [
        ["Target", "5"],
        ["Filled", "3"],
        ["This week", "1"],
      ],
    },
    chartTitle: "Statistics",
    chartSubtitle: "Applicant activity across your open roles",
    chartData: WEEKLY_APPLICATIONS,
    chartTabs: [
      { label: "Applications", multiplier: 1 },
      { label: "Interviews", multiplier: 0.35 },
      { label: "Hires", multiplier: 0.1 },
    ],
    bottomTitle: "Your jobs",
    bottomIcon: CalendarCheck,
    // items/renderer intentionally omitted — the employer branch fetches
    // real data via useMyJobs() in the component instead (see below).
  },
};

export function Dashboard() {
  const { user } = useAuth();
  const config = ROLE_CONFIG[user?.role] ?? ROLE_CONFIG[USER_ROLES.SEEKER];
  const BottomIcon = config.bottomIcon;
  const isEmployer = user?.role === USER_ROLES.EMPLOYER;

  // Only fetches for employers — /jobs/mine is an employer-only endpoint,
  // and this hook still runs (per Rules of Hooks) for a seeker, it just
  // stays disabled and its result is unused in that branch.
  const {
    data: myJobs,
    isLoading: jobsLoading,
    isError: jobsError,
  } = useMyJobs({
    enabled: isEmployer,
  });

  // One extra query per role, purely to power the stat cards below —
  // each is gated to the role that actually owns the endpoint, same
  // pattern as useMyJobs above.
  const { data: employerApplications } = useApplications(undefined, {
    enabled: isEmployer,
  });

  // Per-job applicant counts, computed from the same applications list
  // rather than trusting a job.applicantsCount field from the API — this
  // is the same workaround ManageJobs.jsx already uses, since the
  // backend doesn't reliably annotate jobs with their applicant count.
  const recentJobs = (myJobs ?? []).slice(0, 5).map((job) => ({
    ...job,
    applicantsCount: (employerApplications ?? []).filter(
      (app) => String(app.jobId) === String(job.id),
    ).length,
  }));
  const {
    data: myApplications,
    isLoading: applicationsLoading,
    isError: applicationsError,
  } = useMyApplications({ enabled: !isEmployer });
  const { data: savedJobs } = useSavedJobs({ enabled: !isEmployer });

  // ML-matched jobs for the seeker's resume (JobRecommendationController) —
  // seeker-only, same enable gating pattern as the queries above.
  const {
    data: recommendedJobs,
    isLoading: recommendedLoading,
    isError: recommendedError,
  } = useRecommendedJobs({ enabled: !isEmployer });
  const [currency] = useCurrency();

  // applicationService.mine() is already newest-first from the backend
  // (JobApplication::latest()), so this is just "take the top 5".
  const recentApplications = (myApplications ?? []).slice(0, 5);

  const STAT_VALUES = {
    applications: myApplications?.length ?? 0,
    saved: savedJobs?.length ?? 0,
    interviews: (myApplications ?? []).filter(
      (app) => app.status === "interview",
    ).length,
    openJobs: (myJobs ?? []).filter((job) => job.status === "Open").length,
    totalApplicants: employerApplications?.length ?? 0,
  };

  const stats = config.statDefs.map((def) => ({
    ...def,
    value: STAT_VALUES[def.key],
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className={cn("grid gap-6", config.radial && "lg:grid-cols-3")}>
        <div
          className={cn(
            "grid gap-4",
            config.statsGridCols,
            config.radial && "lg:col-span-2",
          )}
        >
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {config.radial && (
          <Card className="flex flex-col items-center text-center">
            <div className="flex w-full items-center justify-between">
              <h2 className="text-base font-semibold text-text">
                {config.radial.title}
              </h2>
            </div>
            <p className="mt-0.5 self-start text-sm text-accent">
              {config.radial.subtitle}
            </p>
            <RadialProgress
              percent={config.radial.percent}
              label={config.radial.label}
            />
            <p className="text-sm text-accent">{config.radial.note}</p>
            <div className="mt-4 grid w-full grid-cols-3 divide-x divide-primary/10 border-t border-primary/10 pt-4 text-center">
              {config.radial.footer.map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-accent">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-text">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {!isEmployer && (recommendedJobs?.length > 0 || recommendedLoading) && (
        <Card>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-secondary" />
            <h2 className="text-base font-semibold text-text">
              Recommended for you
            </h2>
          </div>
          <p className="mt-0.5 text-sm text-accent">
            Jobs matched to your resume's skills and experience.
          </p>
          <div className="mt-4">
            <QueryState
              isLoading={recommendedLoading}
              isError={recommendedError}
              errorLabel="Could not load recommendations"
            >
              <div className="flex flex-col gap-4">
                {(recommendedJobs ?? []).slice(0, 3).map((job) => (
                  <JobCard key={job.id} job={job} currency={currency} />
                ))}
              </div>
            </QueryState>
          </div>
        </Card>
      )}

      <StatisticsPanel
        title={config.chartTitle}
        subtitle={config.chartSubtitle}
        dateRangeLabel="Sep 11 - Sep 17"
        tabs={config.chartTabs.map((tab) => ({
          label: tab.label,
          panel: (
            <MiniBarChart
              data={config.chartData.map((d) => ({
                ...d,
                value: Math.round(d.value * tab.multiplier),
              }))}
            />
          ),
        }))}
      />

      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BottomIcon className="h-4 w-4 text-secondary" />
            <h2 className="text-base font-semibold text-text">
              {config.bottomTitle}
            </h2>
          </div>
          {isEmployer && (
            <Link
              to="/employer/jobs"
              className="text-sm text-secondary hover:underline"
            >
              View all
            </Link>
          )}
        </div>

        {isEmployer ? (
          <div className="mt-4">
            <QueryState
              isLoading={jobsLoading}
              isError={jobsError}
              errorLabel="Could not load your jobs"
            >
              <div className="divide-y divide-primary/10">
                {recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between py-3 text-sm"
                  >
                    <p className="font-medium text-text">{job.title}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-accent">
                        {job.applicantsCount} applicant
                        {job.applicantsCount === 1 ? "" : "s"}
                      </span>
                      {/* If you renamed this to job.totalApplicants, that's why it showed
                          nothing — normalizeJob() in jobService.js only ever outputs
                          applicantsCount, not totalApplicants. */}
                      <Badge
                        tone={job.status === "Open" ? "success" : "neutral"}
                      >
                        {job.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {recentJobs.length === 0 && (
                  <p className="py-6 text-center text-sm text-accent">
                    You haven't posted any jobs yet.
                  </p>
                )}
              </div>
            </QueryState>
          </div>
        ) : (
          <div className="mt-4">
            <QueryState
              isLoading={applicationsLoading}
              isError={applicationsError}
              errorLabel="Could not load your applications"
            >
              <div className="divide-y divide-primary/10">
                {recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-text">{app.jobTitle}</p>
                      <p className="text-accent">{app.company ?? "—"}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-accent">
                        {formatDate(app.appliedAt)}
                      </span>
                      <Badge
                        tone={APPLICATION_STATUS_TONE[app.status] ?? "neutral"}
                        className="capitalize"
                      >
                        {app.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {recentApplications.length === 0 && (
                  <p className="py-6 text-center text-sm text-accent">
                    You haven't applied to any jobs yet.
                  </p>
                )}
              </div>
            </QueryState>
          </div>
        )}
      </Card>
    </div>
  );
}
