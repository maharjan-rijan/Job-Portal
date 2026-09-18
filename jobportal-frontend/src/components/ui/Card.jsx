import { cn } from "@/utils/cn";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-card border border-ink-100 bg-white p-5 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
