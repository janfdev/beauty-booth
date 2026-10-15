import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "outline" | "lavender";
}

export function Badge({
  className,
  variant = "primary",
  ...props
}: BadgeProps) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide select-none transition-colors";

  const variants = {
    primary:
      "bg-[#FB6F92]/15 text-[#FB6F92] border border-[#FB6F92]/25",
    secondary:
      "bg-[#FFE5EC] text-[#2B2D42] border border-[#FB6F92]/20",
    outline:
      "bg-white/80 text-[#2B2D42] border border-[#2B2D42]/15 shadow-2xs",
    lavender:
      "bg-[#E8DFF5] text-[#5A4E7A] border border-[#5A4E7A]/20",
  };

  return <div className={cn(base, variants[variant], className)} {...props} />;
}
