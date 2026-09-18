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

const MONTHLY_APPLICATIONS = [
  { month: "Jan", value: 2 }, { month: "Feb", value: 4 }, { month: "Mar", value: 3 },
  { month: "Apr", value: 5 }, { month: "May", value: 3 }, { month: "Jun", value: 2 },
  { month: "Jul", value: 4 }, { month: "Aug", value: 1 }, { month: "Sep", value: 3 },
  { month: "Oct", value: 6 }, { month: "Nov", value: 5 }, { month: "Dec", value: 1 },
];

const RECENT_APPLICATIONS = [
  { id: "1", title: "Software Engineer", company: "Winbrans", status: "interview", appliedAt: "2026-09-10" },
  { id: "2", title: "UI/UX Designer", company: "UD Design", status: "applied", appliedAt: "2026-09-08" },
  { id: "3", title: "Web Developer", company: "Webinner", status: "rejected", appliedAt: "2026-08-30" },
];

const STATUS_TONE = { applied: "neutral", interview: "brand", rejected: "danger", hired: "success" };

function MiniBarChart({ data }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e3e7eb" vertical={false} />
          <XAxis dataKey="month" stroke="#8b98a5" fontSize={12} axisLine={false} tickLine={false} />
          <YAxis stroke="#8b98a5" fontSize={12} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#2042e3" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SeekerDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
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
        </div>

        <Card className="flex flex-col items-center text-center">
          <div className="flex w-full items-center justify-between">
            <h2 className="text-base font-semibold text-ink-900">
              Profile completeness
            </h2>
          </div>
          <p className="mt-0.5 self-start text-sm text-ink-500">
            Finish your profile to get noticed
          </p>
          <RadialProgress percent={70} label="+10%" />
          <p className="text-sm text-ink-500">
            Add your work experience to reach 100%.
          </p>
          <div className="mt-4 grid w-full grid-cols-3 divide-x divide-ink-100 border-t border-ink-100 pt-4 text-center">
            {[
              ["Interviews", "3"],
              ["Offers", "1"],
              ["This week", "2"],
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
        subtitle="Your application activity over time"
        dateRangeLabel="Sep 11 - Sep 17"
        tabs={[
          { label: "Applications", panel: <MiniBarChart data={MONTHLY_APPLICATIONS} /> },
          {
            label: "Interviews",
            panel: <MiniBarChart data={MONTHLY_APPLICATIONS.map((d) => ({ ...d, value: Math.round(d.value * 0.4) }))} />,
          },
          {
            label: "Offers",
            panel: <MiniBarChart data={MONTHLY_APPLICATIONS.map((d) => ({ ...d, value: Math.round(d.value * 0.15) }))} />,
          },
        ]}
      />

      <Card>
        <div className="flex items-center gap-2">
          <CalendarCheck className="h-4 w-4 text-brand-500" />
          <h2 className="text-base font-semibold text-ink-900">
            Recent applications
          </h2>
        </div>
        <div className="mt-4 divide-y divide-ink-100">
          {RECENT_APPLICATIONS.map((app) => (
            <div key={app.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-medium text-ink-900">{app.title}</p>
                <p className="text-ink-500">{app.company}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-ink-400">{formatDate(app.appliedAt)}</span>
                <Badge tone={STATUS_TONE[app.status]}>{app.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
