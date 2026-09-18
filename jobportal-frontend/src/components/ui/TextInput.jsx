import { forwardRef } from "react";
import { cn } from "@/utils/cn";

export const TextInput = forwardRef(function TextInput(
  { label, error, className, id, ...props },
  ref
) {
  const inputId = id ?? props.name;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={cn(
          "h-11 rounded-lg border border-ink-200 px-3.5 text-sm text-ink-900",
          "placeholder:text-ink-300 focus:border-brand-500",
          error && "border-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});
