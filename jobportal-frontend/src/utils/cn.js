import clsx from "clsx";

/**
 * Thin wrapper around clsx so UI components can compose conditional
 * Tailwind classes: cn("base-class", isActive && "active-class").
 */
export function cn(...inputs) {
  return clsx(...inputs);
}
