import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

function getPageNumbers(page, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  let start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  start = Math.max(1, end - 4);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  from,
  to,
  totalItems,
  className,
}) {
  if (totalPages <= 1) return null;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between gap-3 border-t border-primary/10 px-5 py-3 sm:flex-row",
        className,
      )}
    >
      <p className="text-xs text-accent">
        Showing {from}–{to} of {totalItems}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="flex h-8 w-8 items-center justify-center rounded-md text-accent hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {getPageNumbers(page, totalPages)[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm text-accent hover:bg-background"
            >
              1
            </button>
            <span className="px-1 text-accent">…</span>
          </>
        )}

        {getPageNumbers(page, totalPages).map((n) => (
          <button
            key={n}
            onClick={() => onPageChange(n)}
            aria-current={n === page ? "page" : undefined}
            className={cn(
              "flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm",
              n === page
                ? "bg-secondary text-white"
                : "text-accent hover:bg-background",
            )}
          >
            {n}
          </button>
        ))}

        {getPageNumbers(page, totalPages).at(-1) < totalPages && (
          <>
            <span className="px-1 text-accent">…</span>
            <button
              onClick={() => onPageChange(totalPages)}
              className="flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm text-accent hover:bg-background"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-md text-accent hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
