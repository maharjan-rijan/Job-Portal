import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useTheme } from "@/hooks/useTheme";

// Recharts renders raw SVG attributes, not Tailwind classes, so it can't
// read CSS variables directly — these mirror the palette's secondary/
// accent tokens for each theme so the chart repaints on toggle.
const PALETTE = {
  light: { bar: "#10b981", grid: "#e2e8f0", axis: "#64748b" },
  dark: { bar: "#34d399", grid: "#3f3f46", axis: "#a1a1aa" },
};

export function MiniBarChart({ data, dataKey = "value", xKey }) {
  const { theme } = useTheme();
  const colors = PALETTE[theme] ?? PALETTE.light;
  const resolvedXKey =
    xKey ?? Object.keys(data[0] ?? {}).find((key) => key !== dataKey);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={colors.grid}
            vertical={false}
          />
          <XAxis
            dataKey={resolvedXKey}
            stroke={colors.axis}
            fontSize={12}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke={colors.axis}
            fontSize={12}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip />
          <Bar dataKey={dataKey} fill={colors.bar} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
