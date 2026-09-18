import { Users2, Briefcase, CalendarCheck } from "lucide-react";
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

const WEEKLY_APPLICATIONS = [
  { day: "Mon", value: 4 }, { day: "Tue", value: 7 }, { day: "Wed", value: 5 },
  { day: "Thu", value: 9 }, { day: "Fri", value: 6 }, { day: "Sat", value: 2 },
  { day: "Sun", value: 3 },
];

const OPEN_JOBS = [
  { id: "1", title: "Software Engineer", applicants: 24, status: "Open" },
  { id: "2", title: "Graphic Designer", applicants: 11, status: "Open" },
  { id: "3", title: "UI/UX Designer", applicants: 31, status: "Closed" },
];

function MiniBarChart({ data }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e3e7eb" vertical={false} />
          <XAxis dataKey="day" stroke="#8b98a5" fontSize={12} axisLine={false} tickLine={false} />
          <YAxis stroke="#8b98a5" fontSize={12} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#2042e3" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function EmployerDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          <StatCard
            icon={Briefcase}
            label="Open jobs"
            value={2}
            trend={{ direction: "up", value: "1 new" }}
          />
          <StatCard
            icon={Users2}
            label="Total applicants"
            value={66}
            trend={{ direction: "up", value: "12.4%" }}
          />
        </div>

        <Card className="flex flex-col items-center text-center">
          <div className="flex w-full items-center justify-between">
            <h2 className="text-base font-semibold text-ink-900">
              Hiring target
            </h2>
          </div>
          <p className="mt-0.5 self-start text-sm text-ink-500">
            Positions filled this quarter
          </p>
          <RadialProgress percent={55} label="+10%" />
          <p className="text-sm text-ink-500">
            You're on track to fill both roles by month end.
          </p>
          <div className="mt-4 grid w-full grid-cols-3 divide-x divide-ink-100 border-t border-ink-100 pt-4 text-center">
            {[
              ["Target", "5"],
              ["Filled", "3"],
              ["This week", "1"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-ink-400">{label}</p>
                <p className="mt-1 text-sm font-semibold text-ink-900">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <StatisticsPanel
        title="Statistics"
        subtitle="Applicant activity across your open roles"
        dateRangeLabel="Sep 11 - Sep 17"
        tabs={[
          { label: "Applications", panel: <MiniBarChart data={WEEKLY_APPLICATIONS} /> },
          {
            label: "Interviews",
            panel: <MiniBarChart data={WEEKLY_APPLICATIONS.map((d) => ({ ...d, value: Math.round(d.value * 0.35) }))} />,
          },
          {
            label: "Hires",
            panel: <MiniBarChart data={WEEKLY_APPLICATIONS.map((d) => ({ ...d, value: Math.round(d.value * 0.1) }))} />,
          },
        ]}
      />

      <Card>
        <div className="flex items-center gap-2">
          <CalendarCheck className="h-4 w-4 text-brand-500" />
          <h2 className="text-base font-semibold text-ink-900">Your jobs</h2>
        </div>
        <div className="mt-4 divide-y divide-ink-100">
          {OPEN_JOBS.map((job) => (
            <div key={job.id} className="flex items-center justify-between py-3 text-sm">
              <p className="font-medium text-ink-900">{job.title}</p>
              <div className="flex items-center gap-4">
                <span className="text-ink-500">{job.applicants} applicants</span>
                <Badge tone={job.status === "Open" ? "success" : "neutral"}>
                  {job.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
