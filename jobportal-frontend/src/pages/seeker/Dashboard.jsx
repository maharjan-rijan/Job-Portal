import { FileText, Heart, CalendarCheck } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { RadialProgress } from "@/components/ui/RadialProgress";
import { StatisticsPanel } from "@/components/ui/StatisticsPanel";
import { formatDate } from "@/utils/formatters";
import {MiniBarChart} from "@/components/ui/MiniBarChart"

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

const RECENT_APPLICATIONS = [
  {
    id: "1",
    title: "Software Engineer",
    company: "Winbrans",
    status: "interview",
    appliedAt: "2026-09-10",
  },
  {
    id: "2",
    title: "UI/UX Designer",
    company: "UD Design",
    status: "applied",
    appliedAt: "2026-09-08",
  },
  {
    id: "3",
    title: "Web Developer",
    company: "Webinner",
    status: "rejected",
    appliedAt: "2026-08-30",
  },
];

const STATUS_TONE = {
  applied: "neutral",
  interview: "brand",
  rejected: "danger",
  hired: "success",
};


export function SeekerDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="grid gap-4 sm:grid-cols-3 lg:col-span-3">
          <StatCard
            icon={FileText}
            label="Applications sent"
            value={12}
            trend={{ direction: "up", value: "8.2%" }}
          />
          <StatCard
            icon={Heart}
            label="Saved jobs"
            value={8}
            trend={{ direction: "up", value: "2.4%" }}
          />
           <StatCard
            icon={Heart}
            label="Saved jobs"
            value={8}
            trend={{ direction: "up", value: "2.4%" }}
          />
        </div>
      </div>

      <StatisticsPanel
        title="Statistics"
        subtitle="Your application activity over time"
        dateRangeLabel="Sep 11 - Sep 17"
        tabs={[
          {
            label: "Applications",
            panel: <MiniBarChart data={MONTHLY_APPLICATIONS} />,
          },
          {
            label: "Interviews",
            panel: (
              <MiniBarChart
                data={MONTHLY_APPLICATIONS.map((d) => ({
                  ...d,
                  value: Math.round(d.value * 0.4),
                }))}
              />
            ),
          },
          {
            label: "Offers",
            panel: (
              <MiniBarChart
                data={MONTHLY_APPLICATIONS.map((d) => ({
                  ...d,
                  value: Math.round(d.value * 0.15),
                }))}
              />
            ),
          },
        ]}
      />

      <Card>
        <div className="flex items-center gap-2">
          <CalendarCheck className="h-4 w-4 text-secondary" />
          <h2 className="text-base font-semibold text-text">
            Recent applications
          </h2>
        </div>
        <div className="mt-4 divide-y divide-ink-100">
          {RECENT_APPLICATIONS.map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between py-3 text-sm"
            >
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
      </Card>
    </div>
  );
}
