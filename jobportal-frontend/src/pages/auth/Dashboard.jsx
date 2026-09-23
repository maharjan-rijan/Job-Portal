import { Link } from "react-router-dom";
import { FileText, Heart, CalendarCheck, Users2, Briefcase, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { RadialProgress } from "@/components/ui/RadialProgress";
import { StatisticsPanel } from "@/components/ui/StatisticsPanel";
import { MiniBarChart } from "@/components/ui/MiniBarChart";
import { useAuth } from "@/hooks/useAuth";
import { useMyJobs } from "@/hooks/useJobs";
import { useMyApplications, useApplications } from "@/hooks/useApplications";
import { useSavedJobs } from "@/hooks/useSavedJobs";
import { formatDate } from "@/utils/formatters";
import { cn } from "@/utils/cn";
import { USER_ROLES } from "@/utils/constants";

const MONTHLY_APPLICATIONS = [
  { month: "Jan", value: 2 }, { month: "Feb", value: 4 }, { month: "Mar", value: 3 },
  { month: "Apr", value: 5 }, { month: "May", value: 3 }, { month: "Jun", value: 2 },
  { month: "Jul", value: 4 }, { month: "Aug", value: 1 }, { month: "Sep", value: 3 },
  { month: "Oct", value: 6 }, { month: "Nov", value: 5 }, { month: "Dec", value: 1 },
];

const WEEKLY_APPLICATIONS = [
  { day: "Mon", value: 4 }, { day: "Tue", value: 7 }, { day: "Wed", value: 5 },
  { day: "Thu", value: 9 }, { day: "Fri", value: 6 }, { day: "Sat", value: 2 },
  { day: "Sun", value: 3 },
];

const RECENT_APPLICATIONS = [
  { id: "1", title: "Software Engineer", company: "Winbrans", status: "interview", appliedAt: "2026-09-10" },
  { id: "2", title: "UI/UX Designer", company: "UD Design", status: "applied", appliedAt: "2026-09-08" },
  { id: "3", title: "Web Developer", company: "Webinner", status: "rejected", appliedAt: "2026-08-30" },
];

const STATUS_TONE = { applied: "neutral", interview: "brand", rejected: "danger", hired: "success" };

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
    bottomItems: RECENT_APPLICATIONS,
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
      footer: [["Target", "5"], ["Filled", "3"], ["This week", "1"]],
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
  const { data: myJobs, isLoading: jobsLoading, isError: jobsError } = useMyJobs({
    enabled: isEmployer,
  });
  const recentJobs = (myJobs ?? []).slice(0, 5);

  // One extra query per role, purely to power the stat cards below —
  // each is gated to the role that actually owns the endpoint, same
  // pattern as useMyJobs above.
  const { data: employerApplications } = useApplications(undefined, { enabled: isEmployer });
  const { data: myApplications } = useMyApplications({ enabled: !isEmployer });
  const { data: savedJobs } = useSavedJobs({ enabled: !isEmployer });

  const STAT_VALUES = {
    applications: myApplications?.length ?? 0,
    saved: savedJobs?.length ?? 0,
    interviews: (myApplications ?? []).filter((app) => app.status === "interview").length,
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
            config.radial && "lg:col-span-2"
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
            <RadialProgress percent={config.radial.percent} label={config.radial.label} />
            <p className="text-sm text-accent">{config.radial.note}</p>
            <div className="mt-4 grid w-full grid-cols-3 divide-x divide-primary/10 border-t border-primary/10 pt-4 text-center">
              {config.radial.footer.map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-accent">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-text">{value}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

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
            <h2 className="text-base font-semibold text-text">{config.bottomTitle}</h2>
          </div>
          {isEmployer && (
            <Link to="/employer/jobs" className="text-sm text-secondary hover:underline">
              View all
            </Link>
          )}
        </div>

        {isEmployer ? (
          <div className="mt-4">
            {jobsLoading && (
              <div className="flex justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-secondary" />
              </div>
            )}
            {jobsError && (
              <p className="py-6 text-center text-sm text-red-600">
                Could not load your jobs.
              </p>
            )}
            {!jobsLoading && !jobsError && (
              <div className="divide-y divide-primary/10">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between py-3 text-sm">
                    <p className="font-medium text-text">{job.title}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-accent">
                        {job.applicantsCount} applicant{job.applicantsCount === 1 ? "" : "s"}
                      </span>
                      <Badge tone={job.status === "Open" ? "success" : "neutral"}>
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
            )}
          </div>
        ) : (
          <div className="mt-4 divide-y divide-primary/10">
            {config.bottomItems.map((app) => (
              <div key={app.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-text">{app.title}</p>
                  <p className="text-accent">{app.company}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-accent">{formatDate(app.appliedAt)}</span>
                  <Badge tone={STATUS_TONE[app.status]}>{app.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
