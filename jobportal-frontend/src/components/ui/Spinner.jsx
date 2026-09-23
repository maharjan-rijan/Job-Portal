import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

export function Spinner({ fullSection = false, className }) {
  return (
    <div className={cn("flex justify-center", fullSection ? "py-24" : "py-16", className)}>
      <Loader2 className="h-6 w-6 animate-spin text-secondary" />
    </div>
  );
}
