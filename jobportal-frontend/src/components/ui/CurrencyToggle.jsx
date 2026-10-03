import { cn } from "@/utils/cn";

const CURRENCIES = [
  { code: "USD", flag: "🇺🇸", label: "US Dollar" },
  { code: "NPR", flag: "🇳🇵", label: "Nepali Rupee" },
];

/** Segmented USD/NPR toggle, shown as flags. Controlled — pass `value` + `onChange`. */
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
      {CURRENCIES.map(({ code, flag, label }) => (
        <button
          key={code}
          type="button"
          aria-pressed={value === code}
          aria-label={label}
          title={label}
          onClick={() => onChange(code)}
          className={cn(
            "rounded-md px-2.5 py-1.5 text-lg leading-none transition-colors",
            value === code
              ? "bg-secondary/10 ring-1 ring-secondary"
              : "opacity-60 hover:opacity-100",
          )}
        >
          <span aria-hidden="true">{flag}</span>
        </button>
      ))}
    </div>
  );
}
