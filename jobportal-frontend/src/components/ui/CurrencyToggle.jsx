import { cn } from "@/utils/cn";

const CURRENCIES = ["USD", "NPR"];

/** Segmented USD/NPR toggle. Controlled — pass `value` + `onChange`. */
export function CurrencyToggle({ value, onChange, className }) {
  return (
    <div
      role="group"
      aria-label="Currency"
      className={cn(
        "inline-flex items-center rounded-lg border border-primary/20 bg-surface p-1",
        className,
      )}
    >
      {CURRENCIES.map((currency) => (
        <button
          key={currency}
          type="button"
          aria-pressed={value === currency}
          onClick={() => onChange(currency)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            value === currency
              ? "bg-secondary text-white"
              : "text-accent hover:text-text",
          )}
        >
          {currency}
        </button>
      ))}
    </div>
  );
}