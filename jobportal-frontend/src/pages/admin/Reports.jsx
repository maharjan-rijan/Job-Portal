import { useMemo, useState } from "react";
import { Download, Users, Building2, Briefcase, FileCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { MiniBarChart } from "@/components/ui/MiniBarChart";
import { QueryState } from "@/components/ui/QueryState";
import { useAdminReports } from "@/hooks/useAdmin";
import { cn } from "@/utils/cn";

function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

const RANGE_PRESETS = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
  { label: "All time", days: null },
];

/** Builds and downloads a CSV from the summary + breakdown data — no backend endpoint needed for this part, it's just the numbers already on screen. */
function downloadCsv(report, range) {
  const rows = [
    ["Report range", `${range.from ?? "all time"} to ${range.to ?? "today"}`],
    [],
    ["Metric", "Value"],
    ["Jobs posted", report.summary.jobsPosted],
    ["Applications received", report.summary.applications],
    ["New seekers", report.summary.newSeekers],
    ["New employers", report.summary.newEmployers],
    [],
    ["Jobs by status"],
    ...report.jobsByStatus.map((row) => [row.name ?? row.label, row.value]),
    [],
    ["Applications by status"],
    ...report.applicationsByStatus.map((row) => [
      row.name ?? row.label,
      row.value,
    ]),
    [],
    ["Signups by role"],
    ...report.signupsByRole.map((row) => [row.name ?? row.label, row.value]),
  ];

  const csv = rows.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `jobsansar-report-${toISODate(new Date())}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function Breakdown({ title, data }) {
  return (
    <Card>
      <h2 className="text-base font-semibold text-text">{title}</h2>
      {data.length > 0 ? (
        <div className="mt-4">
          <MiniBarChart data={data} />
        </div>
      ) : (
        <p className="mt-4 py-10 text-center text-sm text-accent">
          No data for this range yet.
        </p>
      )}
    </Card>
  );
}

export function Reports() {
  const [presetIndex, setPresetIndex] = useState(1); // "Last 30 days"

  const range = useMemo(() => {
    const preset = RANGE_PRESETS[presetIndex];
    if (preset.days === null) return { from: undefined, to: undefined };

    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - preset.days);
    return { from: toISODate(from), to: toISODate(to) };
  }, [presetIndex]);

  const { data: report, isLoading, isError, error } = useAdminReports(range);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-text">Reports</h1>
          <p className="mt-1 text-sm text-accent">
            Platform activity for the selected period — jobs posted,
            applications, and signups.
          </p>
        </div>

        <button
          onClick={() => report && downloadCsv(report, range)}
          disabled={!report}
          className="flex h-10 items-center gap-2 rounded-lg border border-primary/20 px-4 text-sm font-medium text-text hover:bg-background disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {RANGE_PRESETS.map((preset, index) => (
          <button
            key={preset.label}
            onClick={() => setPresetIndex(index)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              index === presetIndex
                ? "bg-secondary text-white"
                : "bg-background text-accent hover:text-text",
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        errorLabel="Could not load the report"
      >
        {report && (
          <div className="mt-6 flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={Briefcase}
                label="Jobs posted"
                value={report.summary.jobsPosted.toLocaleString()}
              />
              <StatCard
                icon={FileCheck}
                label="Applications"
                value={report.summary.applications.toLocaleString()}
              />
              <StatCard
                icon={Users}
                label="New seekers"
                value={report.summary.newSeekers.toLocaleString()}
              />
              <StatCard
                icon={Building2}
                label="New employers"
                value={report.summary.newEmployers.toLocaleString()}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Breakdown title="Jobs by status" data={report.jobsByStatus} />
              <Breakdown
                title="Applications by status"
                data={report.applicationsByStatus}
              />
              <Breakdown title="Signups by role" data={report.signupsByRole} />
            </div>
          </div>
        )}
      </QueryState>
    </div>
  );
}
