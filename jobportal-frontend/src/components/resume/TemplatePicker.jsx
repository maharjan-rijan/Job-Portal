import { Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { RESUME_TEMPLATES, RESUME_COLORS } from "@/utils/constants";

/**
 * Lets the seeker pick a resume template + accent color. Purely
 * presentational and controlled — the caller (ResumePreview) owns
 * persisting the selection, this just reports { template, color }.
 */
export function TemplatePicker({ template, color, onChange, disabled }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-sm font-medium text-primary">Template</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          {RESUME_TEMPLATES.map((option) => {
            const selected = option.id === template;
            return (
              <button
                key={option.id}
                type="button"
                disabled={disabled}
                onClick={() => onChange({ template: option.id, color })}
                className={cn(
                  "rounded-lg border p-3 text-left transition-colors disabled:opacity-50",
                  selected ? "border-secondary bg-secondary/5" : "border-primary/15 hover:border-primary/30"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text">{option.label}</span>
                  {selected && <Check className="h-4 w-4 text-secondary" />}
                </div>
                <p className="mt-1 text-xs text-accent">{option.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-primary">Color</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {RESUME_COLORS.map((option) => {
            const selected = option.hex.toLowerCase() === (color ?? "").toLowerCase();
            return (
              <button
                key={option.id}
                type="button"
                disabled={disabled}
                onClick={() => onChange({ template, color: option.hex })}
                aria-label={option.label}
                title={option.label}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full ring-offset-2 disabled:opacity-50",
                  selected && "ring-2 ring-secondary"
                )}
                style={{ backgroundColor: option.hex }}
              >
                {selected && <Check className="h-4 w-4 text-white" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
