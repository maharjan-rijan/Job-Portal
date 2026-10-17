import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/utils/cn";
import { useTheme } from "@/hooks/useTheme";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "system", label: "Auto (match device)", icon: Monitor },
  { value: "dark", label: "Dark", icon: Moon },
];

/** Light / Auto / Dark segmented switch. Used in every header so the choice is available on all pages. */
export function ThemeToggle({ className }) {
  const { preference, setPreference } = useTheme();

  return (
    <div
      role="group"
      aria-label="Theme"
      className={cn(
        "inline-flex items-center rounded-lg border border-primary/20 bg-surface p-0.5",
        className,
      )}
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          aria-pressed={preference === value}
          aria-label={label}
          title={label}
          onClick={() => setPreference(value)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
            preference === value
              ? "bg-secondary/10 text-secondary ring-1 ring-secondary"
              : "text-accent hover:text-text",
          )}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
