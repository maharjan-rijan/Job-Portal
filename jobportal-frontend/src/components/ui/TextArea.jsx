import { forwardRef } from "react";
import { cn } from "@/utils/cn";

export const TextArea = forwardRef(function TextArea(
  { label, error, className, id, rows = 5, ...props },
  ref,
) {
  const inputId = id ?? props.name;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-primary">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        ref={ref}
        rows={rows}
        className={cn(
          "rounded-lg border border-primary/20 px-3.5 py-3 text-sm text-text",
          "placeholder:text-accent focus:border-brand-500",
          error && "border-red-500",
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});
