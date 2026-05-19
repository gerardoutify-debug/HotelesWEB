import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "gold" | "success" | "warn" | "danger" | "info" }) {
  const variants: Record<string, string> = {
    default: "bg-white/5 text-[var(--color-text)] border-white/10",
    gold: "bg-[var(--color-primary)]/12 text-[var(--color-primary)] border-[var(--color-primary)]/30",
    success: "bg-emerald-500/12 text-emerald-300 border-emerald-500/30",
    warn: "bg-amber-500/12 text-amber-300 border-amber-500/30",
    danger: "bg-red-500/12 text-red-300 border-red-500/30",
    info: "bg-sky-500/12 text-sky-300 border-sky-500/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] uppercase tracking-wider font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
