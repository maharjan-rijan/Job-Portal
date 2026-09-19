import { Users, Building2, Briefcase, FileCheck } from "lucide-react";
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

const MONTHLY_SIGNUPS = [
  { month: "Jan", value: 120 },
  { month: "Feb", value: 180 },
  { month: "Mar", value: 150 },
  { month: "Apr", value: 220 },
  { month: "May", value: 190 },
  { month: "Jun", value: 260 },
  { month: "Jul", value: 240 },
  { month: "Aug", value: 210 },
  { month: "Sep", value: 280 },
  { month: "Oct", value: 310 },
  { month: "Nov", value: 290 },
  { month: "Dec", value: 180 },
];

const RECENT_ACTIVITY = [
  {
    id: "1",
    label: "New employer verified",
    meta: "Winbrans",
    time: "2h ago",
    tone: "success",
  },
  {
    id: "2",
    label: "Job flagged for review",
    meta: "Sales Manager @ Marketers",
    time: "5h ago",
    tone: "warning",
  },
  {
    id: "3",
    label: "New seeker signup",
    meta: "priya.n@example.com",
    time: "1d ago",
    tone: "neutral",
  },
];

function MiniBarChart({ data }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e3e7eb"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            stroke="#8b98a5"
            fontSize={12}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="#8b98a5"
            fontSize={12}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip />
          <Bar dataKey="value" fill="#2042e3" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Job seekers"
          value="8,214"
          trend={{ direction: "up", value: "11.0%" }}
        />
        <StatCard
          icon={Building2}
          label="Employers"
          value="1,032"
          trend={{ direction: "up", value: "4.6%" }}
        />
        <StatCard
          icon={Briefcase}
          label="Active jobs"
          value="3,412"
          trend={{ direction: "up", value: "6.8%" }}
        />
        <StatCard
          icon={FileCheck}
          label="Applications"
          value="18,905"
          trend={{ direction: "down", value: "2.1%" }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StatisticsPanel
            title="Platform growth"
            subtitle="New signups across the platform"
            dateRangeLabel="Sep 11 - Sep 17"
            tabs={[
              {
                label: "Signups",
                panel: <MiniBarChart data={MONTHLY_SIGNUPS} />,
              },
              {
                label: "Jobs posted",
                panel: (
                  <MiniBarChart
                    data={MONTHLY_SIGNUPS.map((d) => ({
                      ...d,
                      value: Math.round(d.value * 0.3),
                    }))}
                  />
                ),
              },
              {
                label: "Applications",
                panel: (
                  <MiniBarChart
                    data={MONTHLY_SIGNUPS.map((d) => ({
                      ...d,
                      value: Math.round(d.value * 1.8),
                    }))}
                  />
                ),
              },
            ]}
          />
        </div>

        <Card className="flex flex-col items-center text-center">
          <div className="flex w-full items-center justify-between">
            <h2 className="text-base font-semibold text-text">
              Monthly target
            </h2>
          </div>
          <p className="mt-0.5 self-start text-sm text-accent">
            New verified employers this month
          </p>
          <RadialProgress percent={76} label="+10%" />
          <p className="text-sm text-accent">
            76 of 100 target employers onboarded so far.
          </p>
          <div className="mt-4 grid w-full grid-cols-3 divide-x divide-ink-100 border-t border-primary/10 pt-4 text-center">
            {[
              ["Target", "100"],
              ["Onboarded", "76"],
              ["Today", "4"],
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
        <h2 className="text-base font-semibold text-text">Recent activity</h2>
        <div className="mt-4 divide-y divide-ink-100">
          {RECENT_ACTIVITY.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between py-3 text-sm"
            >
              <div>
                <p className="font-medium text-text">{activity.label}</p>
                <p className="text-accent">{activity.meta}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-accent">{activity.time}</span>
                <Badge tone={activity.tone}>
                  {activity.tone === "warning" ? "Review" : "Info"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
