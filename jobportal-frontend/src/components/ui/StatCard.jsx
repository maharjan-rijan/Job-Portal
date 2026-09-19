import { ArrowDown, ArrowUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

/**
 * trend: { direction: "up" | "down", value: "11.01%" } — omit for no badge.
 */
export function StatCard({ icon: Icon, label, value, trend, className }) {
  return (
    <Card className={cn("flex flex-col gap-4", className)}>
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-background">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-accent">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-text">{value}</p>
        </div>
        {trend && (
          <span
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
              trend.direction === "up"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600",
            )}
          >
            {trend.direction === "up" ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
            {trend.value}
          </span>
        )}
      </div>
    </Card>
  );
}
