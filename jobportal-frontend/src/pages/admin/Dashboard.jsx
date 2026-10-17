import { Users, Building2, Briefcase, FileCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { RadialProgress } from "@/components/ui/RadialProgress";
import { StatisticsPanel } from "@/components/ui/StatisticsPanel";
import { MiniBarChart } from "@/components/ui/MiniBarChart";
import { QueryState } from "@/components/ui/QueryState";
import { useAdminDashboard } from "@/hooks/useAdmin";
import { formatRelative } from "@/utils/formatters";

// Maps the backend's event `type` to how it's badged here. Kept in the
// component (not constants.js) since nothing outside this page cares
// about admin activity types.
const ACTIVITY_META = {
  employer_signup: { badge: "Employer", tone: "success" },
  seeker_signup: { badge: "Seeker", tone: "neutral" },
  job_posted: { badge: "Job", tone: "brand" },
  application_submitted: { badge: "Application", tone: "brand" },
};

export function AdminDashboard() {
  const { data, isLoading, isError, error } = useAdminDashboard();

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error} errorLabel="Could not load the dashboard">
      {data && (
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Users}
              label="Job Seekers"
              value={data.stats.seekers.value.toLocaleString()}
              trend={data.stats.seekers.trend}
            />
            <StatCard
              icon={Building2}
              label="Employers"
              value={data.stats.employers.value.toLocaleString()}
              trend={data.stats.employers.trend}
            />
            <StatCard
              icon={Briefcase}
              label="Active Jobs"
              value={data.stats.activeJobs.value.toLocaleString()}
              trend={data.stats.activeJobs.trend}
            />
            <StatCard
              icon={FileCheck}
              label="Applications"
              value={data.stats.applications.value.toLocaleString()}
              trend={data.stats.applications.trend}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <StatisticsPanel
                title="Platform Growth"
                subtitle="New activity across the platform, last 12 months"
                tabs={[
                  { label: "Signups", panel: <MiniBarChart data={data.growth.signups} /> },
                  { label: "Jobs Posted", panel: <MiniBarChart data={data.growth.jobsPosted} /> },
                  { label: "Applications", panel: <MiniBarChart data={data.growth.applications} /> },
                ]}
              />
            </div>

            <Card className="flex flex-col items-center text-center">
              <div className="flex w-full items-center justify-between">
                <h2 className="text-base font-semibold text-text">
                  Monthly Target
                </h2>
              </div>
              <p className="mt-0.5 self-start text-sm text-accent">
                New employers this month
              </p>
              <RadialProgress percent={data.employerOnboarding.percent} />
              <p className="text-sm text-accent">
                {data.employerOnboarding.onboarded} of {data.employerOnboarding.target} target employers onboarded so far.
              </p>
              <div className="mt-4 grid w-full grid-cols-2 divide-x divide-ink-100 border-t border-primary/10 pt-4 text-center">
                {[
                  ["Target", data.employerOnboarding.target],
                  ["Onboarded", data.employerOnboarding.onboarded],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-accent">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-text">{value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card>
            <h2 className="text-base font-semibold text-text">Recent Activity</h2>
            <div className="mt-4 divide-y divide-ink-100">
              {data.recentActivity.map((activity) => {
                const meta = ACTIVITY_META[activity.type] ?? { badge: "Info", tone: "neutral" };
                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-text">{activity.label}</p>
                      <p className="text-accent">{activity.meta}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-accent">{formatRelative(activity.createdAt)}</span>
                      <Badge tone={meta.tone}>{meta.badge}</Badge>
                    </div>
                  </div>
                );
              })}
              {data.recentActivity.length === 0 && (
                <p className="py-6 text-center text-sm text-accent">
                  Nothing's happened on the platform yet.
                </p>
              )}
            </div>
          </Card>
        </div>
      )}
    </QueryState>
  );
}
