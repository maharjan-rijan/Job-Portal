import { cn } from "@/utils/cn";

function initials(name = "") {
  return name
    .split(" ")
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({ src, name, size = 40, className, style }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name ? `${name}'s avatar` : "Avatar"}
        className={cn("shrink-0 rounded-full object-cover", className)}
        style={{ height: size, width: size, ...style }}
      />
    );
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-secondary/10 font-semibold text-secondary",
        className
      )}
      style={{ height: size, width: size, fontSize: size * 0.35, ...style }}
    >
      {initials(name)}
    </span>
  );
}
