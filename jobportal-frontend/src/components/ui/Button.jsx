import { cn } from "@/utils/cn";

const VARIANTS = {
  primary: "bg-brand-500 text-white hover:bg-brand-600",
  secondary: "bg-brand-50 text-brand-600 hover:bg-brand-100",
  outline: "border border-ink-200 text-ink-900 hover:bg-ink-50",
  ghost: "text-ink-700 hover:bg-ink-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const SIZES = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  className,
  isLoading = false,
  disabled,
  children,
  ...props
}) {
  return (
    <Component
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-60",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </Component>
  );
}
