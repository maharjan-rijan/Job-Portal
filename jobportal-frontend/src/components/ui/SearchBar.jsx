import { Search } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * Controlled search field. Pass `onSubmit` to render a trailing button
 * (e.g. the homepage's "Search Jobs" CTA); omit it for an inline filter
 * field that just reacts to onChange (e.g. the job list page).
 */
export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search…",
  submitLabel = "Search",
  className,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex items-center gap-2 rounded-lg border border-primary/20 bg-surface px-3.5",
        className,
      )}
    >
      <Search className="h-4.5 w-4.5 shrink-0 text-accent" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full border-0 bg-transparent text-sm text-text placeholder:text-accent focus:outline-none"
      />
      {onSubmit && (
        <button
          type="submit"
          className="shrink-0 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
        >
          {submitLabel}
        </button>
      )}
    </form>
  );
}
